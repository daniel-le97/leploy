export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  console.log(id)

  if (!id)
    return 'not found'
  const body = await readBody(event)
  // console.log(body);
  // console.log(event);
  const db = useDbStorage('compose')

  // const db = useStorage('db')

  if (await db.hasItem(id))
    await db.setItem(id, body)
})
