import * as fs from 'node:fs'
import * as os from 'node:os'
import * as YAML from 'js-yaml'
import type { Subprocess } from 'bun'
import { $ } from 'bun'
import { Server } from '../core/server'

export interface Job {
  finish: () => void
  failed: () => boolean
  getPath: () => string
  cleanPath: (path?: string) => void
  // gitClone: () => Promise<void>
  clone: () => Promise<void>
  build: () => Promise<void>
  deploy: () => Promise<void>
  getProjectEnv: () => Record<string, any>
  getComposeFile: (project: SqliteProject) => string
  project: SqliteProject
  id: string
  killed: boolean
}

async function parseTar(path: string, out: string) {
  await $`mkdir -p ${out}`
  const shell = await $`tar -xzvf ${path} -C ${out}`
  return shell
}

export class ProjectJob implements Job {
  project: SqliteProject
  id = crypto.randomUUID()
  exitCodes: number[] = []
  logContent = ''
  killed = false
  enqueuedTime = Bun.nanoseconds()
  buildTime = 0
  tar: Uint8Array | null = null
  shell: Subprocess<'ignore', 'pipe', 'pipe'> | null = null
  type: string
  compose = ''
  isCompose: boolean

  constructor(project: SqliteProject, type?: string) {
    this.project = project
    this.type = type || 'manual'
    this.isCompose = this.project.buildPack === 'docker-compose'
    // we probably want to create a job in the database here
  }

  finish() {
    console.log({content:this.logContent})
    const end = (Bun.nanoseconds() - this.buildTime)
    const enqueuedTime = (this.enqueuedTime)
    const buildLog: BuildLog = {
      id: this.id,
      projectId: this.project.id,
      buildTime: end.toString(),
      data: this.logContent,
      tar: this.failed() ? undefined : this.tar!,
      compose: this.compose,
      status: this.failed() ? 'failed' : 'success',
      createdAt: Date.now().toString(),
      type: this.type,
    }
    logsService.createLogs(buildLog)
    Server().publish(this.project.id, JSON.stringify({ type: 'logs', data: buildLog }))
  }

  failed() {
    for (const code of this.exitCodes) {
      if (code !== 0)
        return true
    }
    return false
  }

  getPath() {
    const temp = os.tmpdir()
    return `./temp/${this.project.id}`
  }

  ensurePath(path = this.getPath()) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, {
        recursive: true,
      })
    }
  }

  cleanPath(path = this.getPath()) {
    if (fs.existsSync(path))
      fs.rmSync(path, { recursive: true, force: true })
  }

  async clone() {
    this.buildTime = Bun.nanoseconds()

    const branch = this.project.branch || 'main'
    const commands = ['git', 'clone', '--depth=1', '--shallow-submodules', `--branch=${branch}`, `${this.project.repoUrl}.git`, this.getPath()]
    // this.publish(`clone: ${commands.join(' ')}\n\n`)
    this.shell = Bun.spawn(commands, { env: this.getProjectEnv(), stdio: ['ignore', 'pipe', 'pipe'] })
    await this.sendStream(this.shell)
    // this.publish(`\nclone: finished\n\n`)
  }

  async fetchClone() {
    this.buildTime = Bun.nanoseconds()
    const repoURL = this.project.repoUrl
    const repoName = repoURL.split('/').pop()
    const branch = this.project.branch || 'main'
    const archiveURL = `${repoURL}/archive/${branch}.tar.gz`
    const data = (await fetch(archiveURL))
    this.tar = new Uint8Array(await data.arrayBuffer())

    this.publish(`fetching: ${archiveURL}\n\n`)
    const tar = `./.data/tar/${this.id}.tar.gz`
    await Bun.write(tar, this.tar)
    const sizeInBytes = this.tar.length
    const sizeInMegabytes = sizeInBytes / (1024 * 1024)

    const shell = await parseTar(tar, this.getPath())
    this.exitCodes.push(shell.exitCode)
    this.publish(`\nfetching: finished - Size in mb ${sizeInMegabytes.toFixed(2)}\n\n`)
  }

  async build() {
    if (this.failed())
      return

    let commands: string[] = []
    const builder = this.project.buildPack || 'nixpacks'
    if (builder === 'nixpacks')
      commands = [`nixpacks`, `build`, this.getPath(), `--name`, `${this.project.id}`]

    if (builder === 'dockerfile')
      commands = [`docker`, `build`, '--pull', '--rm', '-f', `${this.getPath()}${this.project.buildPackHelper || '/Dockerfile'}`, `-t`, `${this.project.id}`, `${this.getPath()}`]

    if (builder === 'docker-compose')
      commands = ['docker', 'compose', '-f', `${this.getPath()}${this.project.buildPackHelper || '/docker-compose.yml'}`, 'build']

    // this.publish(`\nbuild: ${commands.join(' ')}\n\n`)
    this.shell = Bun.spawn(commands, { env: this.getProjectEnv(), stdio: ['ignore', 'pipe', 'pipe'] })
    await this.sendStream(this.shell)
    // this.publish(`\nbuild: finished\n\n`)
  }

  async deploy() {
    if (this.failed())
      return

    let path = `${this.getPath()}`
    if (!this.isCompose) {
      this.compose = this.getComposeFile()
      path = `${this.getPath()}/${this.id}.yml`
      await Bun.write(path, this.compose)
    }
    else {
      path = `${this.getPath()}${this.project.buildPackHelper || '/docker-compose.yml'}`
    }
    const commands = ['docker', 'compose', '-f', path, 'up', '-d']
    // this.publish(`\ndeploy: ${commands.join(' ')}\n\n`)
    this.shell = Bun.spawn(commands, { env: this.getProjectEnv(), stdio: ['ignore', 'pipe', 'pipe'] })
    await this.sendStream(this.shell)
    // this.publish(`\ndeploy: finished\n\n`)
  }

  getProjectEnv() {
    const envs: Record<string, any> = {
      ...process.env,
      NIXPACKS_INSTALL_CMD: this.project.installCommand ?? undefined,
      NIXPACKS_BUILD_CMD: this.project.buildCommand ?? undefined,
      NIXPACKS_START_CMD: this.project.startCommand ?? undefined,
    }
    const projectEnvs = projectEnvService.getProjectEnvs(this.project.id)
    for (const env of projectEnvs)
      envs[env.name] = env.value

    return envs
  }

  getComposeFile(project: SqliteProject = this.project) {
    const traefik = true
    const serviceName = project.name
    let labels: string[]
    let ports = project.ports.split(',')
    if (!ports.length)
      ports = ['3000']

    const domain = 'localhost'
    const environment = Object.entries(this.getProjectEnv()).filter(env => env[1]).map(compose => `${compose[0]}=${compose[1]}`)
    const compose: DockerComposeConfig = {
      version: '3',
      services: {
        [serviceName]: {
          image: `${project.id}`,
          networks: ['le-ploy'],
          ports: ports.map(port => `${port}:${port}`).filter(Boolean),
          restart: 'always',
          environment,
          labels: traefik
            ? [
                'traefik.enable=true',
        `traefik.http.routers.${serviceName}.rule=Host(\`${serviceName}.${domain}\`)`,
        `traefik.http.routers.${serviceName}.entrypoints=web`,
        `traefik.http.services.${serviceName}.loadbalancer.server.port=${ports[0]}`,
        `traefik.http.services.${serviceName}.loadbalancer.server.scheme=http`,
              ]
            : undefined,
        },
      },
      networks: {
        'le-ploy': {
          external: true,
        },
      },

    }
    const yaml = YAML.dump(compose)
    // console.log(yaml)
    return yaml
  }

  async sendStream(buildProcess: Subprocess<'ignore', 'pipe', 'pipe'>) {
    const write = (chunk: Uint8Array) => {
      let data = decode(chunk)
      if (this.killed) {
        buildProcess.kill(9)
        data += '\nERROR: build process killed by user\n'
      }
      this.publish(data)
    }
    buildProcess.stdout.pipeTo(new WritableStream({ write }))
    buildProcess.stderr.pipeTo(new WritableStream({ write }))
    this.exitCodes.push(await buildProcess.exited)
  }

  publish(data: string) {
    console.log(data);
    Server().publish(this.project.id, JSON.stringify({ type: 'build', data }))
    this.logContent += data
  }
}
