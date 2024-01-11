export default defineEventHandler(async (event) => {
  const start = performance.now()
  const session = await getUserSession(event)
  const end = performance.now()
  console.log('time', end - start)
  return session
})
