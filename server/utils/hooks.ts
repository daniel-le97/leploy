import type { Server as BunServer } from 'bun'
import { createHooks } from 'hookable'
import { Server } from '../core/server';

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
  build: (payload: BuildPayload) => void | Promise<void>
  start: (server: BunServer) => void | Promise<void>
}
export const serverHooks = createHooks<ServerHooks>()

serverHooks.hook('build', async (payload) => {
  console.log('hooks:build', payload.id)
  let count = 0
  const interval = setInterval(() => {
    if (count === 10)
      clearInterval(interval)

      const string = `${crypto.randomUUID()}\n`
      console.log('publishing', string);
      
    Server().publish(payload.projectId, string)

    count++
  }, 1000)
})
