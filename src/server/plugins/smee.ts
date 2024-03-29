import consola from 'consola'

export default defineNitroPlugin(async (nitroApp) => {
  if (!import.meta.dev || !process.env.WEBHOOK_PROXY_URL)
    return

  const SmeeClient = await import('smee-client').then(m => m.default || m)

  const smee = new SmeeClient({
    source: process.env.WEBHOOK_PROXY_URL,
    target: 'http://localhost:3000/api/git/webhooks/12345',
    logger: consola,
  })

  const events = smee.start()

  // consola.info('Smee started forwarding https://smee.io/2CheYVHetZe4ROm to http://localhost:3000/api/webhooks ')

  nitroApp.hooks.hook('close', async () => {
    consola.info('Stopping Smee forwarding')
    events.close()
  })
  // Stop forwarding events
})
