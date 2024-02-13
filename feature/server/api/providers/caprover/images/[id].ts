const cwd = process.cwd()

export default defineCachedEventHandler(async (event) => {
  // TODO check what is typing event
  // @ts-expect-error event is typed Different for some reason?
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 404,
      statusMessage: 'image not found',
    })
  }
  const db = useDbStorage('templates:caprover:logos')
  const hasItem = await db.hasItem(id)
  if (!hasItem) {
    throw createError({
      statusCode: 404,
      statusMessage: 'image not found',
    })
  }

  // let _data: string = ''
  const file = Bun.file(`${cwd}/data/templates/caprover/logos/${id}`)

  // createReadSteam()

  return new Response(file)
  // return await sendWebResponse(event, new Response(file))
  // return sendStream(event, await file.stream())
})
