import * as fs from 'node:fs'
import { kill } from 'node:process'
import consola from 'consola'
import type { Subprocess } from 'bun'
import type { SqliteProject } from '../../types/project'
import { Server } from '../core/server'
import { Job } from './job'

class Queue {
  queue: SqliteProject[] | null
  isProcessing: boolean
  fileContents: string
  shell: Subprocess<'ignore', 'pipe', 'pipe'> | null = null
  job: Job | null = null
  // project: QueueHelper | null = null
  killed = false
  type = new Map<string, string>()
  // _listeners: Listener[] = []

  constructor() {
    this.queue = []
    this.isProcessing = false
    this.fileContents = ''
  }

  async killJob(projectId: string) {
    if (this.job?.project.id === projectId) {
      const data = '\nERROR: build process killed by user\n'
      this.fileContents += data
      console.log('killing build:', projectId)
      this.shell?.kill(9)
      kill(this.shell!.pid!)
      await this.shell?.exited
      this.killed = true
      this.shell?.unref()
      this.shell = null

      Server().publish(projectId, JSON.stringify({ type: 'build', data }))
      this.job = null
    }
    if (this.queue)
      this.queue = this.queue.filter(project => project.id !== projectId)
  }

  async addJob(Project: SqliteProject, type?: string) {
    this.queue?.push(Project)
    this.type.set(Project.id, type || 'manual')

    if (!this.isProcessing)
      await this.processQueue()
  }

  async processQueue() {
    if (this.queue?.length === 0) {
      this.isProcessing = false
      this.job = null
      this.killed = false
      return
    }

    const project = this.queue?.shift()
    if (!project)
      return

    this.isProcessing = true
    this.killed = false
    this.fileContents = ''
    this.job = new Job(project)

    console.log(`Processing project: ${project.id} at ${Date.now()}`)
    await this.processJob(project)

    this.type.delete(project.id)
    await this.processQueue()
  }

  private async processJob(project: SqliteProject) {
    const start = Bun.nanoseconds()

    const job = this.job!
    const generatedName = project.name
    const repoPath = job.getPath()

    job.cleanPath()

    //clone the project
    const git = await this.sendStream(this.shell = job.clone())

    // build the project with specified builder or default to nixpacks
    const build = await this.sendStream(this.shell = job.build())

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

    job.cleanPath()

    // await Bun.write(`${project.logsPath + generateId}.txt`, this.fileContents)
  }

  async sendStream(buildProcess: Subprocess<'ignore', 'pipe', 'pipe'>) {
    const write = (chunk: Uint8Array) => {
      if (this.killed)
        return

      const data = decode(chunk)
      console.log(data)

      Server().publish(this.job!.project.id!, JSON.stringify({ type: 'build', data }))
      this.fileContents += data
    }
    buildProcess.stdout.pipeTo(new WritableStream({ write }))
    buildProcess.stderr.pipeTo(new WritableStream({ write }))
    return await buildProcess.exited
  }
}

export const queue = new Queue()
