import * as fs from 'node:fs'
import * as os from 'node:os'
import type { Subprocess } from 'bun'
import { $ } from 'bun'
import { Server } from '../core/server'
import { getDomain } from './getCompose'

export interface Job {
  finish: () => Promise<void>
  failed: () => boolean
  getPath: () => string
  cleanPath: (path?: string) => void
  fetchClone: () => Promise<void>
  // gitClone: () => Promise<void>
  clone: () => Promise<void>
  build: () => Promise<void>
  deploy: () => Promise<void>
  getProjectEnv: () => Record<string, any>
  project: SqliteProject
  id: string
  killed: boolean
}

async function parseTar(path: string, out: string) {
  await $`mkdir -p ${out}`
  const shell = await $`tar -xzvf ${path} -C ${out} --strip-components=1`
  return shell
}

function getPort() {
  const server = Bun.serve({
    port: 0,
    fetch(request, server) {
      return new Response('Hello, world!')
    },
  })
  const port = server.port
  server.stop()
  return port
}

// const label = 'leploy=a0a6a8b7-acca-4642-8129-a35ac9a6d315'
// grabs the port of the container based off of label id
async function getContainerPort(label: string) {
  const projectId = label.split('=')[1]
  try {
    const containerId = (await $`docker ps -q --filter "label=${label}"`.text()).trim()
    const containerInspect = await $`docker container inspect ${containerId}`.json()
    const ports = (containerInspect[0].NetworkSettings as { Ports: { [key: string]: [{ HostPort: string }] } }).Ports
    const key = Object.keys(ports)[0]
    const port = ports[key][0].HostPort
    return port
  }
  catch (error) {
    console.log(`error getting container port for project:${projectId}`, error)
  }
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
  url = ''
  label = ''
  commitHash = ''
  domain = ''

  constructor(project: SqliteProject, type?: string) {
    this.project = project
    this.type = type || 'manual'
    this.isCompose = this.project.buildPack === 'docker-compose'
    this.domain = getDomain(project)
    // we probably want to create a job in the database here
  }

  async finish() {
    if (this.failed() === false) {
      const port = await getContainerPort(`leploy=${this.project.id}`)
      this.url = `http://${this.domain}:${port}`
      this.publish(`\n\n${this.url}\n\n`)
      this.project.deployed = this.url
      projectsService.updateProject(this.project.id, this.project)
      Server().publish(this.project.id, JSON.stringify({ type: 'deployed', data: this.url }))
      console.log(this.label)
    }
    // await fs.promises.rm(this.getPath(), { force: true, recursive: true })

    const end = (Bun.nanoseconds() - this.buildTime)
    const enqueuedTime = (this.enqueuedTime)
    const buildLog: BuildLog = {
      id: this.id,
      projectId: this.project.id,
      buildTime: end.toString(),
      data: this.logContent,
      commitHash: this.commitHash || '',
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
    return `${process.cwd()}/app-data/temp/${this.project.id}`
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
    this.commitHash = (await $`git -C ${this.getPath()} rev-parse HEAD`.text()).trim()
    console.log(this.commitHash)

    // this.publish(`\nclone: finished\n\n`)
  }

  // prefer clone over fetchClone
  async fetchClone() {
    this.buildTime = Bun.nanoseconds()
    const repoURL = this.project.repoUrl
    const repoName = repoURL.split('/').pop()
    const branch = this.project.branch || 'main'
    const archiveURL = `${repoURL}/archive/${branch}.tar.gz`
    const data = (await fetch(archiveURL))
    this.tar = new Uint8Array(await data.arrayBuffer())

    this.publish(`fetching: ${archiveURL}\n\n`)
    const tar = `${process.cwd()}/app-data/tar/${this.id}.tar.gz`
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
      this.compose = getComposeFile(this.project, this.domain)
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

  getProjectEnv(includeProcessEnv = true) {
    const processENV = includeProcessEnv ? process.env : undefined
    const nixEnvs = this.project.buildPack === 'nixpacks'
      ? {
          NIXPACKS_INSTALL_CMD: this.project.installCommand ?? undefined,
          NIXPACKS_BUILD_CMD: this.project.buildCommand ?? undefined,
          NIXPACKS_START_CMD: this.project.startCommand ?? undefined,
        }
      : undefined
    const envs: Record<string, any> = {
      ...processENV,
      ...nixEnvs,
      FORCE_COLOR: '1',
    }
    const projectEnvs = projectEnvService.getProjectEnvs(this.project.id)
    for (const env of projectEnvs)
      envs[env.name] = env.value

    return envs
  }

  async sendStream(buildProcess: Subprocess<'ignore', 'pipe', 'pipe'>) {
    const write = (chunk: Uint8Array) => {
      let data = decode(chunk)
      if (this.killed) {
        buildProcess.kill(9)
        data += '\nERROR: build process killed by user\n'
        this.publish(data)
        return
      }
      // console.log(data);

      this.publish(data)
    }
    // for await (const data of buildProcess.stderr) {
    //   write(data)
    // }
    // for await (const data of buildProcess.stdout) {
    //   write(data)
    // }
    buildProcess.stdout.pipeTo(new WritableStream({ write }))
    buildProcess.stderr.pipeTo(new WritableStream({ write }))
    this.exitCodes.push(await buildProcess.exited)
  }

  publish(data: string) {
    // console.log(data)
    Server().publish(this.project.id, JSON.stringify({ type: 'build', data }))
    this.logContent += data
  }
}
