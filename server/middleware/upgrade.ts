export default defineEventHandler(async (event) => {
  const headers = getHeaders(event)
  if (headers.connection === 'Upgrade' && headers.upgrade === 'websocket') {
    const context = event.context
    const socketId = crypto.randomUUID()
    setHeader(event, 'x-socket-id', socketId)
    const session = await getUserSession(event)
    const upgrade = context.server.upgrade(context.request, { data: { socketId, session } })
    if (!upgrade)
      throw createError({ message: 'upgrade failed', statusCode: 500 })

    return upgrade
  }
})
