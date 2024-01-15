import * as fs from 'node:fs'
import { execa } from 'execa'
import { createHooks } from 'hookable'
import consola from 'consola'
import YAML from 'yaml'

class Queue {
  hooks = createHooks()
  queue: ProcessProject[] | null
  isProcessing: boolean
  fileContents: string
  activeProject: ProcessProject | null = null
  textDecoder = new TextDecoder()
  // _listeners: Listener[] = []

  constructor() {
    this.queue = []
    this.isProcessing = false
    this.fileContents = ''
  }

  async addProject(Project: ProcessProject) {
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

  private async doProject(project: ProcessProject) {
    const start = performance.now()
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

    await this.runCommandAndSendStream(['git', 'clone', '--depth=1', `${''}`, `${repoPath}`], project.id)

    await this.runCommandAndSendStream([`nixpacks`, `build`, `${repoPath}`, `--name`, `${generatedName}`], project.id)

    const end = performance.now()

    await Bun.write(`${project.logsPath + generateId}.txt`, this.fileContents)
  }

  toDecode(chunk: Uint8Array) {
    if (chunk instanceof Uint8Array || Buffer.isBuffer(chunk))
      return this.textDecoder.decode(chunk)

    return chunk as string
  }

  private async runCommandAndSendStream(commands: string[], projectId: string, env = {}) {
    try {
      console.log('running:', commands)

      const _command = Bun.spawn(commands, {
        stdio: ['inherit', 'pipe', 'pipe'],
      })

      const { stdout, stderr } = _command
      const stdoutChunks = await Bun.readableStreamToArray(stdout)
      const stderrChunks = await Bun.readableStreamToArray(stderr)
      for await (const chunk of stdoutChunks) {
        const decoded = this.toDecode(chunk)
        console.log('stdout', decoded)
      }
      for await (const chunk of stderrChunks) {
        const decoded = this.toDecode(chunk)
        console.log('stderr', decoded)
      }
    }
    catch (error) {
      console.log(error)
      consola.withTag('command:failed').error(`${commands.join(' ')}`)
    }
  }
}

export const queue = new Queue()
