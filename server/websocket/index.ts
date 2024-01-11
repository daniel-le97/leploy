import type { Server as BunServer, ServerWebSocket, WebSocketHandler } from 'bun'
import { Server } from '../core/server'

type WS = ServerWebSocket<{
  socketId: string
  auth: {
    id?: string | undefined
    name?: string | undefined
    image?: string | undefined
  }
  channels: string[]
}>

interface Payload {
  type: string
  data: string
}

const handlers = new Map<string, (server: BunServer, ws: WS, payload: Payload) => void | Promise<void>>()

  .set('insert', (server, ws, payload) => {
    const { data } = payload
    ws.publish(data, 'hello world')
  })

  .set('update', (server, ws, payload) => {
    const { data } = payload
    ws.subscribe(data)
  })

  .set('delete', (server, ws, payload) => {
    const { data } = payload
    ws.unsubscribe(data)
  })

  .set('build', (server, ws, payload) => {

  })
  .set('unkown', (server, ws, payload) => {

  })
  .set('heartbeat', (server, ws, payload) => {

  })

export const websocket: WebSocketHandler<{ socketId: string, auth: { id?: string, name?: string, image?: string }, channels: string[] }> = {
  open(ws) {
    // i should probably do something here
  },
  async message(ws, message) {
    try {
      const payload = JSON.parse(String(message)) as Payload
      const handler = handlers.get(payload.type) || handlers.get('unkown')
      await handler!(Server(), ws, payload)
    }
    catch (error) {
      console.error(error)
    }
  },
  drain(ws) {
    console.log('server:ws:drain', ws.data)
  },
  close(ws) {

  },
}
