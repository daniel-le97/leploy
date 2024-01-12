export default defineNuxtPlugin(async () => {
  const port = await $fetch('/api/server')
  console.log('websocket port', port)

  const { loggedIn, user, session, fetch, clear } = useUserSession()

  const websocket = useWebSocket<{ type: string }>(`ws://localhost:${port}`, {
    immediate: loggedIn.value,
    autoReconnect: true,
    onConnected: (ws) => {
      console.log('websocket connected', ws)
    },
    onMessage(ws, event) {
      console.log('websocket message', event)
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
