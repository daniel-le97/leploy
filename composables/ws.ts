export function useWs() {
  return useNuxtApp().$websocket as ReturnType<typeof useWebSocket<{type:string}>>
}
