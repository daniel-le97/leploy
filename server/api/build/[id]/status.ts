import { useJoinRoom, useSendRoomMessage } from '../../../utils/reworkSSE'

export default defineEventHandler(async (event: any) => {
  try {
    const session = await requireAuthSession(event)

    const id = getRouterParam(event, 'id')

    if (!id || !session.user?.id)
      throw createError('unable to find id')

    const key = `${session.user.id}:${id}`

    const db = useDbStorage('projects')
    const isProject = await db.hasItem(key)

    if (!isProject)
      throw createError('unable to find project for user')

    const project = await db.getItem<Project>(key)

    const logsPath = `${process.cwd()}/data/logs/${id}/`

    if (!project?.application.repoUrl)
      throw createError('please update your configuration to include a repoURL')

    const isActiveProject = queue.activeProject?.id === id
    const isInQueue = queue.queue?.find(queue => queue.id === id)
    // const isListening = queue._listeners.find(listener => listener.userId === session.user?.id)

    await useJoinRoom(event, `build:${id}`)

    // setInterval(() => {
    //   console.log('subbed');
      
    //   useSendRoomMessage(`build:${id}`, { data: 'building stuff' })
    // }, 1000)



    

    const newProject = {
      ...project,
      logsPath,
      key,
    } as ProcessProject

    await queue.addProject(newProject)
  }

  catch (error) {
    console.log(error)

    throw createError({ statusMessage: `failed to build app` })
  }
})
