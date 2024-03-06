import type { SqliteProject } from '../../../../../types/project'

export default defineEventHandler(async (event) => {
  try {
    // TODO change with auth
    const session = await requireAuthSession(event)
    const id = getRouterParam(event, 'id')
    const body = await readBody<SqliteProject>(event)

    if (!id)
      throw createError({ message: 'please provide an id' })

    const project = await projectsService.updateProject(id, body)
    return { success: !!project }
  }
  catch (error) {
    console.log('invalid id or user')
  }
})
