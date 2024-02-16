import { rm } from 'fs/promises'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id)
    throw createError({ message: 'please provide an id' })

  const session = await requireAuthSession(event)
  const project = await projectsService.getProjectById(id)
  if (!project)
    throw createError({ message: 'project not found' })

  if (project.user !== session.id)
    throw createError({ message: 'unauthorized' })

  console.log('deleting project')
  const log = logsService.getLatestByProjectId(id)
  if (!log) {
    console.log('no logs found')
    return await projectsService.deleteProject(id)
  }

  await Bun.write(`./temp/${project.id}/${log.id}.yml`, log.compose)
  const remove = (await Bun.$`docker-compose -f ./temp/${project.id}/${log.id}.yml down --volumes --remove-orphans --rmi all`).exitCode
  if (remove !== 0)
    console.log('failed to remove project')

  await rm(`./temp/${project.id}/${log.id}.yml`, { force: true })

  await projectsService.deleteProject(id)
})
