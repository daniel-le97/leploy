import * as fs from 'node:fs'
import { kill } from 'node:process'
import consola from 'consola'
import type { Subprocess } from 'bun'
import type { SqliteProject } from '../../types/project'
import { Server } from '../core/server'
import { Job } from './job'

class Queue {
  jobs: SqliteProject[] = []
  isProcessing: boolean = false
  fileContents: string = ''
  job: Job | null = null
  killed = false
  type = new Map<string, string>()

  async killJob(projectId: string) {
    if (this.jobs)
      this.jobs = this.jobs.filter(project => project.id !== projectId)

    if (this.job?.project.id === projectId)
      this.job.killed = true
  }

  async addJob(Project: SqliteProject, type?: string) {
    this.jobs?.push(Project)
    this.type.set(Project.id, type || 'manual')

    if (!this.isProcessing)
      await this.processQueue()
  }

  async processQueue() {
    const project = this.jobs?.shift()
    if (!project) {
      this.isProcessing = false
      this.type.clear()
      Bun.shrink()
      Bun.gc(true)
      return
    }

    this.isProcessing = true
    this.killed = false
    this.fileContents = ''

    console.log(`Processing project: ${project.id} at ${Date.now()}`)
    await this.processJob(project)

    this.type.delete(project.id)
    await this.processQueue()
  }

  private async processJob(project: SqliteProject) {
    this.job = new Job(project)
    this.job.cleanPath()

    // clone the project and push the exit code into an array
    await this.job.clone()
    // build the project
    await this.job.build()
    // deploy the project
    await this.job.deploy()

    this.job.finish(this.type.get(project.id) || 'manual')
  }
}

export const queue = new Queue()
