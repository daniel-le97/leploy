import '#internal/nitro/virtual/polyfill'
import { websocket } from '../websocket'
import { setServer } from './server'

const nitroApp = useNitroApp()


const handler = toWebHandler(nitroApp.h3App)


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
