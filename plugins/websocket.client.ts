import type { BuildLog } from '../types/logs'

export default defineNuxtPlugin(async () => {
  const port = await $fetch('/api/server')
  console.log('websocket port', port)

  const { loggedIn, user, session, fetch, clear } = useUserSession()
  const parse = <T>(data: MessageEvent<any>) => JSON.parse(data.data) as { type: string, data: T }
  const websocket = useWebSocket<{ type: string }>(`ws://localhost:${port}`, {
    immediate: loggedIn.value,
    autoReconnect: true,
    onConnected: (ws) => {
      console.log('websocket connected', ws)
    },
    onMessage(ws, event) {
      const data = parse<string>(event)
      if (data.type === 'build')
        useBuildSSE().value += data.data

      if (data.type === 'logs') {
        const newData = parse<BuildLog>(event)
        console.log('newData', newData)
      }
    },
  })

  watch(loggedIn, (loggedIn) => {
    if (loggedIn)
      websocket.open()

    else
      websocket.close()
  })

  return {
    provide: {
      websocket,
    },
  }
})
