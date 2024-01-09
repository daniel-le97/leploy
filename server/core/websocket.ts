import type { Server as BunServer, ServerWebSocket, WebSocketHandler } from 'bun'

type WS = ServerWebSocket<{
  socketId: string
  auth: {
    id?: string | undefined
    name?: string | undefined
    image?: string | undefined
  }
  channels: string[]
}>

const handlers = new Map<string, (server: BunServer, ws: WS, payload: Record<string, any>) => void | Promise<void>>()

export const websocket: WebSocketHandler<{ socketId: string, auth: { id?: string, name?: string, image?: string }, channels: string[] }> = {
  open(ws) {
    console.log('server:ws:open', ws.data)
    // i should probably do something here
  },
  async message(ws, message) {
    try {
      console.log('server:ws:message', message)
    }
    catch (error) {
      console.error('server:ws:catch-error', error)
    }
  },
  drain(ws) {
    console.log('server:ws:drain', ws.data)
  },
  close(ws) {
    try {
      console.log('server:ws:close', ws.data)
    }
    catch (error) {
      console.error('server:ws:close', error)
    }
  },
}
