export default defineEventHandler(async (event) => {
  const user = await requireAuthSession(event)
  const id = getRouterParam(event, 'id')
  if (!id)
    throw NOTFOUND

  await queue.killBuild(id)
})
