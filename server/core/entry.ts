import '#internal/nitro/virtual/polyfill'
import { websocket } from '../websocket'
import { setServer } from './server'

// @ts-expect-error it is there
import { runNitroTask } from '#internal/nitro/task'

// @ts-expect-error it is there
import { tasks } from '#internal/nitro/virtual/tasks'

const nitroApp = useNitroApp()

// @ts-expect-error H3App is App
const handler = toWebHandler(nitroApp.h3App)

nitroApp.router.get(
  '/_nitro/tasks',
  // @ts-expect-error type import errors
  defineEventHandler((event) => {
    return {
      tasks: Object.fromEntries(
        Object.entries(tasks).map(([name, task]) => [
          name,
          // @ts-expect-error type import errors
          { description: task.description },
        ]),
      ),
    }
  },
  ),
)
nitroApp.router.use(
  '/_nitro/tasks/:name',
  // @ts-expect-error type import errors
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, 'name')
    const payload = {
      ...getQuery(event),
      ...(await readBody(event).catch(() => ({}))),
    }
    return await runNitroTask(name, payload)
  },
  ),
)

const server = Bun.serve({
  port: process.env.NITRO_PORT || process.env.PORT || 3000,
  async fetch(request, server) {
    try {
      const res = await handler(request, { server, request })
      return res
    }
    catch (error) {
      console.error(request.url, error)
    }
  },
  websocket,
})
setServer(server)

serverHooks.callHook('start', server)

console.log(`Listening on http://localhost:${server.port}...`)
