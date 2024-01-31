import * as fs from 'node:fs'
import { kill } from 'node:process'
import consola from 'consola'
import type { Subprocess } from 'bun'
import type { SqliteProject } from '../../types/project'
import { Server } from '../core/server'
import { Job } from './job'

class Queue {
  queue: SqliteProject[] = []
  isProcessing: boolean = false
  fileContents: string = ''
  shell: Subprocess<'ignore', 'pipe', 'pipe'> | null = null
  job: Job | null = null
  exitCodes = [0]
  killed = false
  type = new Map<string, string>()

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
    const project = this.queue?.shift()
    if (!project) {
      this.isProcessing = false
      this.type.clear()
      Bun.shrink()
      return
    }

    this.isProcessing = true
    this.killed = false
    this.fileContents = ''
    this.exitCodes = [0]
 
    console.log(`Processing project: ${project.id} at ${Date.now()}`)
    await this.processJob(project)

    this.type.delete(project.id)
    await this.processQueue()
  }

  deploySuccessfull() {
    for (const code of this.exitCodes) {
      if (code !== 0)
        return false
    }
    return true
  }

  private async processJob(project: SqliteProject) {
    const start = Bun.nanoseconds()

    const job = this.job = new Job(project)
    job.cleanPath()
    // clone the project
    this.exitCodes.push(await this.sendStream(this.shell = job.clone()))

    if (job.needsBuild)
      this.exitCodes.push(await this.sendStream(this.shell = job.build()))

    // await job.deploy()

    this.exitCodes.push(await this.sendStream(this.shell = await job.deploy()))

    const end = (Bun.nanoseconds() - start)
    const buildLog: BuildLog = {
      id: crypto.randomUUID(),
      projectId: project.id,
      buildTime: end.toString(),
      data: this.fileContents,
      status: this.deploySuccessfull() ? 'success' : 'failed',
      createdAt: Date.now().toString(),
      type: this.type.get(project.id) || 'manual',
    }
    logsService.createLogs(buildLog)
    Server().publish(project.id, JSON.stringify({ type: 'logs', data: buildLog }))

    // job.cleanPath()

    // await Bun.write(`${project.logsPath + generateId}.txt`, this.fileContents)
  }

  async sendStream(buildProcess: Subprocess<'ignore', 'pipe', 'pipe'>) {
    const write = (chunk: Uint8Array) => {
      if (this.killed) {
        buildProcess.kill(1)
        return
      }
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
