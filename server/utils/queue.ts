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

    const Project = this.queue?.shift()
    if (!Project)
      return

    this.isProcessing = true
    this.activeProject = Project

    // Trigger 'processProject' hook
    // await this.hooks.callHook('processProject', Project)

    // Simulate Project processing
    console.log(`Processing Project: ${Project.id} at ${new Date(Date.now())}`)
    await this.doProject(Project)

    // Trigger 'afterProcessProject' hook
    // await this.hooks.callHook('afterProcessProject', Project)

    await this.processQueue() // Process the next Project
  }

  private async doProject(project: ProcessProject) {
    const start = performance.now()
    const { id, name, buildsLogs, application, createdAt, configured, deployed } = project
    const { repoUrl, buildPack, buildCommand, installCommand, startCommand } = application
    const generateId = crypto.randomUUID()
    const generatedName = project.name
    const repoPath = `./data/temp/${generatedName}`

    if (fs.existsSync(repoPath))
      fs.rmSync(repoPath, { recursive: true })

    // const generatedName = generateName()
    const date = new Date()
    this.fileContents = ''

    await this.runCommandAndSendStream('git', ['clone', '--depth=1', application.repoUrl, repoPath], project.id)

    await this.runCommandAndSendStream('nixpacks', ['build', repoPath, '--name', generatedName], project.id)

    const end = performance.now()

    if (!fs.existsSync(project.logsPath))
      fs.mkdirSync(project.logsPath, { recursive: true })

    await fs.promises.writeFile(`${project.logsPath + generateId}.txt`, this.fileContents)

    const newBuildLog = {
      id: generateId,
      buildTime: (end - start),
      date,
    }
    // const db = useDbStorage('projects')
    // buildsLogs.push(newBuildLog)
    // await db.setItem(project.key, { ...project, buildsLogs })
    // sseHooks.callHookParallel(`sse:event:${project.id}:close`)
  }
  
  private async runCommandAndSendStream(first: string, command: string[], projectId: string, env = {}) {
    try {
      const decoder = new TextDecoder()
      const toDecode = (chunk: Uint8Array | any) => {
        if (chunk instanceof Uint8Array || Buffer.isBuffer(chunk))
          return decoder.decode(chunk)

        return chunk as string
      }

      console.log('running:', first, command.join(' '))

      const _command = execa(first, command)

      _command.stderr?.on('data', async(data) => {
        const message = toDecode(data)
        // await useSendRoomMessage(`build:${projectId}`, { data: message })
        this.fileContents += `\n${message}`
      })
      _command.stdout?.on('data', async(data) => {
        const message = toDecode(data)
        // await useSendRoomMessage(`build:${projectId}`, { data: message })
        this.fileContents += `\n${message}`
      })

      await _command
      _command.kill()
    }
    catch (error) {
      console.log(error)

      consola.withTag('command:failed').error(`${command}`)
    }
  }
}

export const queue = new Queue()
