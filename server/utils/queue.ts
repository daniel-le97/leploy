import * as fs from 'node:fs'
import { createHooks } from 'hookable'
import consola from 'consola'
import YAML from 'yaml'
import type { Subprocess } from 'bun'
import { $ } from 'bun'
import type { SqliteProject } from '../../types/project'
import { Server } from '../core/server'



class Queue {
  queue: SqliteProject[] | null
  isProcessing: boolean
  fileContents: string
  commandExec: Subprocess<'ignore', 'pipe', 'pipe'> | null = null
  activeProject: SqliteProject | null = null
  killed = false
  textDecoder = new TextDecoder()
  type = new Map<string, string>()
  // _listeners: Listener[] = []

  constructor() {
    this.queue = []
    this.isProcessing = false
    this.fileContents = ''
  }

  async killBuild(projectId: string) {
    if (this.activeProject?.id === projectId) {
      const data = '\nERROR: build process killed by user\n'
      this.fileContents += data
      console.log('killing build:', projectId)
      this.commandExec?.kill(9)
      await this.commandExec?.exited
      this.killed = true
      this.commandExec?.unref()
      this.commandExec = null

      Server().publish(projectId, JSON.stringify({ type: 'build', data }))
      this.activeProject = null
    }
    if (this.queue)
      this.queue = this.queue.filter(project => project.id !== projectId)
  }

  getEnv() {
    const envs: Record<string, any> = {
      ...process.env,
      NIXPACKS_INSTALL_CMD: this.activeProject?.installCommand ?? undefined,
      NIXPACKS_BUILD_CMD: this.activeProject?.buildCommand ?? undefined,
      NIXPACKS_START_CMD: this.activeProject?.startCommand ?? undefined,
    }
    const projectEnvs = projectEnvService.getProjectBuildEnvs(this.activeProject?.id || '')
    for (const env of projectEnvs)
      envs[env.name] = env.value

    return envs
  }

  async addProject(Project: SqliteProject, type?: string) {
    this.queue?.push(Project)
    this.type.set(Project.id, type || 'manual')

    if (!this.isProcessing)
      await this.processQueue()
  }

  async processQueue() {
    if (this.queue?.length === 0) {
      this.isProcessing = false
      this.activeProject = null
      return
    }

    const project = this.queue?.shift()
    if (!project)
      return

    this.isProcessing = true
    this.killed = false
    this.activeProject = project

    console.log(`Processing project: ${project.id} at ${Date.now()}`)
    await this.doProject(project)

    this.type.delete(project.id)
    await this.processQueue()
  }

  private async doProject(project: SqliteProject) {
    const start = Bun.nanoseconds()
    // const { id, name, buildsLogs, application, createdAt, configured, deployed } = project
    // const { repoUrl, buildPack, buildCommand, installCommand, startCommand } = application

    const generatedName = project.name
    const repoPath = `./temp/${generatedName}`

    if (fs.existsSync(repoPath))
      fs.rmSync(repoPath, { recursive: true })

    // const generatedName = generateName()
    const date = new Date()
    this.fileContents = ''

    const git = await this.runCommandAndSendStream(['git', 'clone', '--depth=1', `${project.repoUrl}`, `${repoPath}`])

    const nixCommand = [`nixpacks`, `build`, `${repoPath}`, `--name`, `${generatedName}`]
    // for await (const [key, value] of Object.entries(this.getEnv())) {
    //   if (value)
    //     nixCommand.push(`--${key}`, value)
    // }

    const build = await this.runCommandAndSendStream(nixCommand)

    const isSuccessful = (git === 0 && build === 0)
    const end = (Bun.nanoseconds() - start)
    const buildLog: BuildLog = {
      id: crypto.randomUUID(),
      projectId: project.id,
      buildTime: end.toString(),
      data: this.fileContents,
      status: isSuccessful ? 'success' : 'failed',
      createdAt: Date.now().toString(),
      type: this.type.get(project.id) || 'manual',
    }
    logsService.createLogs(buildLog)
    Server().publish(project.id, JSON.stringify({ type: 'logs', data: buildLog }))

    if (fs.existsSync(repoPath))
      fs.rmSync(repoPath, { recursive: true })

    // await Bun.write(`${project.logsPath + generateId}.txt`, this.fileContents)
  }

  toDecode(chunk: Uint8Array) {
    if (chunk instanceof Uint8Array || Buffer.isBuffer(chunk))
      return this.textDecoder.decode(chunk)

    return chunk as string
  }

  private async runCommandAndSendStream(commands: string[], env = {...process.env}) {
    try {
      console.log('running:', commands.join(' '))
      const project = this.activeProject
      if (!project)
        return

      const write = (chunk: Uint8Array) => {
        if (this.killed)
          return

        const data = this.toDecode(chunk)
        // const data = chunk
        Server().publish(project.id, JSON.stringify({ type: 'build', data }))
        this.fileContents += data
      }

      // for await (const line of $`${commands.join(' ')}`.lines()){
      //   console.log(line) // Hello World!
      //   write(line)
      // }

      // return 0

      this.commandExec = Bun.spawn(commands, {
        stdio: ['ignore', 'pipe', 'pipe'],
        env,
      })
      this.commandExec.stdout.pipeTo(new WritableStream({
        write,
      }))
      this.commandExec.stderr.pipeTo(new WritableStream({
        write,
      }))

      return await this.commandExec.exited
    }
    catch (error) {
      consola.withTag('command:failed').error(`${commands.join(' ')}`)
    }
  }
}

export const queue = new Queue()
