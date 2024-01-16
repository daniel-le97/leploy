import type { BuildPayload } from '../../../utils/hooks'

export default defineEventHandler(async (event: any) => {
  try {
    const session = await requireAuthSession(event)

    const projectId = getRouterParam(event, 'id')

    if (!projectId || !session.id)
      throw createError('unable to find id')

    // const payload: BuildPayload = {
    //   id: crypto.randomUUID(),
    //   projectId,
    //   userId: session.id,
    //   date: Date.now().toString(),
    //   buildTime: null,
    //   logs: null,
    //   status: 'in-queue',
    // }
    // console.log('build', payload);

    const project = await projectsService.getProjectById(projectId)
    await serverHooks.callHook('build', { ...project, type: 'manual' })
    return 'ok'

    // const key = `${session.id}:${id}`

    // const db = useDbStorage('projects')
    // const isProject = await db.hasItem(key)

    // if (!isProject)
    //   throw createError('unable to find project for user')

    // const project = await db.getItem<Project>(key)

    // const logsPath = `${process.cwd()}/data/logs/${id}/`

    // if (!project?.application.repoUrl)
    //   throw createError('please update your configuration to include a repoURL')

    // const isActiveProject = queue.activeProject?.id === id
    // const isInQueue = queue.queue?.find(queue => queue.id === id)

    // if (isActiveProject || isInQueue) {
    //   const connection = SSEEvents.connections.get(session.user.id)
    //   connection?.send({ data: queue.fileContents, event: `build:${id}` })
    //   await useJoinRoom(event, `build:${id}`)
    //   return
    // }

    // await useJoinRoom(event, `build:${id}`)
    // const newProject = {
    //   ...project,
    //   logsPath,
    //   key,
    // } as ProcessProject

    // await queue.addProject(newProject)
  }

  catch (error) {
    console.log(error)

    throw createError({ statusMessage: `failed to build app` })
  }
})
