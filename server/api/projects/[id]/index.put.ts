export default defineEventHandler(async (event) => {
  try {
    // TODO change with auth
    const session = await requireAuthSession(event)
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id)
      throw createError({ message: 'please provide an id' })

    const db = useDbStorage('projects')

    const key = `${session.user?.id}:${id}`

    if (!db.hasItem(key))
      throw createError({ message: 'unable to find project' })

    await db.setItem<Project>(key, { ...body, configured: true })
    return { ...body, configured: true }
  }
  catch (error) {
    console.log('invalid id or user')
  }
})
