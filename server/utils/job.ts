import * as fs from 'node:fs'
import * as os from 'node:os'
import * as YAML from 'js-yaml'
import type { Subprocess } from 'bun'
import { $ } from 'bun'
import { Server } from '../core/server'

async function parseTar(path: string, out: string) {
  await $`mkdir -p ${out}`
  const shell = await $`tar -xzvf ${path} -C ${out}`
  return shell
}

export class Job {
  project: SqliteProject
  id = crypto.randomUUID()
  exitCodes: number[] = []
  logContent = ''
  killed = false
  buildTime = Bun.nanoseconds()
  shell: Subprocess<'ignore', 'pipe', 'pipe'> | null = null
  constructor(project: SqliteProject) {
    this.project = project
    // we probably want to create a job in the database here
  }

  finish(type:string){
    const end = (Bun.nanoseconds() - this.buildTime)
    const buildLog: BuildLog = {
      id: this.id,
      projectId: this.project.id,
      buildTime: end.toString(),
      data: this.logContent,
      status: this.failed() ? 'failed' : 'success',
      createdAt: Date.now().toString(),
      type: type || 'manual',
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

  cleanPath() {
    if (fs.existsSync(this.getPath()))
      fs.rmSync(this.getPath(), { recursive: true, force: true })
  }

  async clone() {
    if (this.failed())
      return

    const branch = this.project.branch || 'main'
    const commands = ['git', 'clone', '--depth=1', '--shallow-submodules', `--branch=${branch}`, `${this.project.repoUrl}.git`, this.getPath()]
    this.publish(`clone: ${commands.join(' ')}\n\n`)
    this.shell = Bun.spawn(commands, { env: this.getProjectEnv(), stdio: ['ignore', 'pipe', 'pipe'] })
    await this.sendStream(this.shell)
    this.publish(`\nclone: finished\n\n`)
  }

  async build() {
    if (this.failed())
      return

    let commands: string[] = []
    const builder = this.project.buildPack || 'nixpacks'
    if (builder === 'nixpacks')
      commands = [`nixpacks`, `build`, this.getPath(), `--name`, `${this.project.id}`]

    if (builder === 'dockerfile')
      commands = [`docker`, `build`, '--pull', '--rm', '-f', `${this.getPath()}${this.project.filePath || '/Dockerfile'}`, `-t`, `${this.project.id}`, `${this.getPath()}`]

    if (builder === 'docker-compose')
      commands = ['docker', 'compose', '-f', this.getPath(), 'build']

    this.publish(`\nbuild: ${commands.join(' ')}\n\n`)
    this.shell = Bun.spawn(commands, { env: this.getProjectEnv(), stdio: ['ignore', 'pipe', 'pipe'] })
    await this.sendStream(this.shell)
    this.publish(`\nbuild: finished\n\n`)
  }

  async deploy() {
    if (this.failed())
      return

    const compose = this.createComposeFile()
    const path = `${this.getPath()}/${this.id}.yml`
    await Bun.write(path, compose)
    const commands = ['docker', 'compose', '-f', path, 'up', '-d']
    this.publish(`\ndeploy: ${commands.join(' ')}\n\n`)
    this.shell = Bun.spawn(commands, { env: this.getProjectEnv(), stdio: ['ignore', 'pipe', 'pipe'] })
    await this.sendStream(this.shell)
    this.publish(`\ndeploy: finished\n\n`)
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

  createComposeFile(project: SqliteProject = this.project) {
    const traefik = true
    const serviceName = project.name
    let labels: string[]
    let ports = project.ports.split(',')
    if (!ports.length)
      ports = ['3000']
      // throw new Error('No ports specified')

    const domain = 'localhost'

    const environment = Object.entries(this.getProjectEnv()).filter(env => env[1]).map(compose => `${compose[0]}=${compose[1]}`)

    const compose: DockerComposeConfig = {
      version: '3',
      services: {
        [serviceName]: {
          image: `${project.id}`,
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
    console.log(data)
    Server().publish(this.project.id, JSON.stringify({ type: 'build', data }))
    this.logContent += data
  }
}
