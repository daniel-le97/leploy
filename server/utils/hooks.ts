import type { Server as BunServer } from 'bun'
import { createHooks } from 'hookable'
import { Server } from '../core/server'
import type { SqliteProject } from '../../types/project'

export interface BuildPayload {
  id: string
  projectId: string
  userId: string
  date: string
  buildTime: number | null
  logs: string | null
  status: 'success' | 'failure' | 'in-queue' | 'in-progress'
}

export interface ServerHooks {
  build: (project: SqliteProject & {type:string}) => void | Promise<void>
  start: (server: BunServer) => void | Promise<void>
}
export const serverHooks = createHooks<ServerHooks>()

serverHooks.hook('build', async (project) => {
  // console.log('hooks:build', payload.id)
  // const project = await projectsService.getProjectById(payload.projectId)
  queue.addProject(project)
})
