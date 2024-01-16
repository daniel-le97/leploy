import * as fs from 'node:fs'
import { execa } from 'execa'
import { createHooks } from 'hookable'
import consola from 'consola'
import YAML from 'yaml'
import type { SqliteProject } from '../../types/project'
import { Server } from '../core/server'

class Queue {
  hooks = createHooks()
  queue: (SqliteProject & { type: string })[] | null
  isProcessing: boolean
  fileContents: string
  activeProject: SqliteProject & { type: string } | null = null
  textDecoder = new TextDecoder()
  // _listeners: Listener[] = []

  constructor() {
    this.queue = []
    this.isProcessing = false
    this.fileContents = ''
  }

  async addProject(Project: SqliteProject & { type: string }) {
    this.queue?.push(Project)
    if (!this.isProcessing)
      await this.processQueue()
  }

  async createComposeFile(project: ProcessProject | Project) {
    const traefik = true
    const serviceName = project.name
    let labels: string[]

    const compose: DockerComposeConfig = {
      version: '3',
      services: {
        [serviceName]: {
          image: serviceName,
          ports: project.ports.map(port => `${port}:${port}`).filter(Boolean),
          restart: 'always',
          labels: traefik
            ? [
                'traefik.enable=true',
        `traefik.http.routers.${serviceName}.rule=Host(\`${serviceName}.localhost\`)`,
        `traefik.http.routers.${serviceName}.entrypoints=web`,
        `traefik.http.services.${serviceName}.loadbalancer.server.port=${project.ports[0]}`,
        `traefik.http.services.${serviceName}.loadbalancer.server.scheme=http`,
              ]
            : [],
        },
      },
    }
    const yaml = YAML.stringify(compose)
  }

  async processQueue() {
    if (this.queue?.length === 0) {
      this.isProcessing = false
      this.activeProject = null
      return
    }

    console.log(this.queue?.length)

    const project = this.queue?.shift()
    if (!project)
      return

    this.isProcessing = true
    this.activeProject = project

    console.log(`Processing project: ${project.id} at ${Date.now()}`)
    await this.doProject(project)

    await this.processQueue()
  }

  private async doProject(project: SqliteProject) {
    const start = Bun.nanoseconds()
    // const { id, name, buildsLogs, application, createdAt, configured, deployed } = project
    // const { repoUrl, buildPack, buildCommand, installCommand, startCommand } = application
    const generateId = crypto.randomUUID()
    const generatedName = project.name
    const repoPath = `./data/temp/${generatedName}`

    if (fs.existsSync(repoPath))
      fs.rmSync(repoPath, { recursive: true })

    // const generatedName = generateName()
    const date = new Date()
    this.fileContents = ''

    await this.runCommandAndSendStream(['git', 'clone', '--depth=1', `${project.repoUrl}`, `${repoPath}`])

    await this.runCommandAndSendStream([`nixpacks`, `build`, `${repoPath}`, `--name`, `${generatedName}`])

    const end = (Bun.nanoseconds() - start)
    const buildLog: BuildLog = {
      id: crypto.randomUUID(),
      projectId: project.id,
      buildTime: end.toString(),
      data: this.fileContents,
      status: 'success',
      createdAt: Date.now().toString(),
      type: this.activeProject?.type || 'manual',
    }
    logsService.createLogs(buildLog)
    Server().publish(project.id, JSON.stringify({ type: 'logs', data: buildLog }))

    // await Bun.write(`${project.logsPath + generateId}.txt`, this.fileContents)
  }

  toDecode(chunk: Uint8Array) {
    if (chunk instanceof Uint8Array || Buffer.isBuffer(chunk))
      return this.textDecoder.decode(chunk)

    return chunk as string
  }

  private async runCommandAndSendStream(commands: string[], env = {}) {
    try {
      console.log('running:', commands)
      const project = this.activeProject
      if (!project)
        return

      const write = (chunk: Uint8Array) => {
        const data = this.toDecode(chunk)
        Server().publish(project.id, JSON.stringify({ type: 'build', data }))
        this.fileContents += data
      }
      const _command = Bun.spawn(commands, {
        stdio: ['ignore', 'pipe', 'pipe'],
      })
      _command.stdout.pipeTo(new WritableStream({
        write,
      }))
      _command.stderr.pipeTo(new WritableStream({
        write,
      }))

      await _command.exited
      _command.kill(1)
    }
    catch (error) {
      console.log(error)
      consola.withTag('command:failed').error(`${commands.join(' ')}`)
    }
  }
}

export const queue = new Queue()
