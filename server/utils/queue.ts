import * as fs from 'node:fs'
import { kill } from 'node:process'
import consola from 'consola'
import type { Subprocess } from 'bun'
import type { SqliteProject } from '../../types/project'
import { Server } from '../core/server'
import type { Job } from './job'
import { ProjectJob } from './job'


class Queue {
  jobs: SqliteProject[] = []
  isProcessing = 0
  job: Job | null = null
  type = new Map()
  limit = 1

  async killJob(projectId: string) {
    if (this.jobs)
      this.jobs = this.jobs.filter(project => project.id !== projectId)

    if (this.job?.project.id === projectId)
      this.job.killed = true
  }

  async addJob(project: SqliteProject, type?: string) {
    this.jobs.push(project)
    this.type.set(project.id, type)

    if (this.isProcessing < this.limit)
      await this.processQueue()
  }

  async processQueue() {
    const project = this.jobs?.shift()
    if (!project) {
      this.isProcessing = 0
      Bun.shrink()
      Bun.gc(true)
      return
    }

    this.isProcessing++

    console.log(`Processing project: ${project.id} at ${Date.now()}`)
    await this.processJob(new ProjectJob(project, this.type.get(project.id)))
    this.type.delete(project.id)

    await this.processQueue()
  }

  private async processJob(job: Job) {
    // make sure the build directory is clean
    job.cleanPath()
    // clone the project and push the exit code into an array
    await job.clone()
    // build the project
    await job.build()
    // deploy the project
    await job.deploy()
    // do some cleanup 
    job.finish()
  }
}

export const queue = new Queue()
