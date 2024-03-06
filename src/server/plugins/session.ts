export default defineNitroPlugin(async () => {
  sessionHooks.hook('fetch', async (session) => {
    console.log('User session fetched', session)

    // Extend User Session
    // Or throw createError({ ... }) if session is invalid
  })

  sessionHooks.hook('clear', async (session) => {
    // Log that user logged out
    console.log('User logged out', session)
  })
})
