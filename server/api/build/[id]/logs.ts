export default defineEventHandler(async (event) => {
  const user = 'me'
  const id = getRouterParam(event, 'id')
  const key = `${user}:${id}`
})
