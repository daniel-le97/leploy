import { websocket } from '../server/websocket/index'

declare let self: Worker

self.onmessage = (event: MessageEvent) => {
  console.log('worker message', event.data)
}

const handler = (await import('../.output/server/index.mjs')).default
const server = Bun.serve({
  port: process.env.NITRO_PORT || process.env.PORT || 3000,
  async fetch(request, server) {
    try {
      console.log(request)

      const res = await handler(request, { server, request })
      if (request.url === '/' && res.headers.get('content-type') === 'text/html') {
        console.log('sending html')

        const html = await res.text()
        self.postMessage({ type: 'html', html })
      }
      return res
    }
    catch (error) {
      console.error(request.url, error)
    }
  },
  websocket,
})
const fetched = (await fetch('http://localhost:3000')).ok
if (!fetched) {
  console.error('Server not started')
  process.exit(1)
}
console.log(`Listening on http://localhost:${server.port}...`)

//   if (request.url === '/' && res.headers.get('content-type') === 'text/html') {
//     console.log('sending html');

//     const html = await res.text()
//     self.postMessage({ type: 'html', html })
//   }
