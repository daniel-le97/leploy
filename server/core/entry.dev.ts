import '#internal/nitro/virtual/polyfill'
import { parentPort } from 'node:worker_threads'
import { websocket } from '../websocket'
import { Server, setServer } from './server'

// @ts-expect-error it is there
import { trapUnhandledNodeErrors } from '#internal/nitro/utils'

const nitroApp = useNitroApp()

const handler = toWebHandler(nitroApp.h3App)

// const routes = nitroApp.h3App.stack
// console.log('routes', routes);
const server = Bun.serve({
  port: 0,
  reusePort: true,
  async fetch(request, server) {
    try {
      return await handler(request, { server, request })
    }
    catch (error) {
      console.error(request.url, error)
    }
  },
  websocket,
})

nitroApp.router.get('/api/server', defineEventHandler(event => server.port))
// console.log('server', server);

setServer(server)

serverHooks.callHook('start', server)

parentPort?.postMessage({
  event: 'listen',
  address: { host: 'localhost', port: server.port },
})

// console.log(Bun.main, Bun.isMainThread, Bun.origin, Bun.argv);

// Trap unhandled errors
trapUnhandledNodeErrors()

// Graceful shutdown
async function onShutdown(signal?: string) {
  // console.log('onShutdown')
  server.stop(true)
  Server()
  await nitroApp.hooks.callHook('close')
  Bun.gc(true)
  Bun.shrink()
  parentPort?.postMessage({ event: 'exit' })
}

parentPort?.on('message', async (msg) => {
  if (msg && msg.event === 'shutdown')
    await onShutdown()
})
