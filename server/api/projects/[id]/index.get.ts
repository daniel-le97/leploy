async function createComposeFile(project: ProcessProject | Project) {
  const traefik = true
  const serviceName = project.name
  let labels: string[]
  if (traefik) {
    labels = [
      'traefik.enable=true',
      `traefik.http.routers.${serviceName}.rule=Host(${serviceName}.localhost)`,
      `traefik.http.routers.${serviceName}.entrypoints=web`,
      `traefik.http.services.${serviceName}.loadbalancer.server.port=${project.ports[0]}`,
      `traefik.http.services.${serviceName}.loadbalancer.server.scheme=http`,
    ]
  }
  else {
    labels = []
  }

  const compose: DockerComposeConfig = {
    version: '3',
    services: {
      [serviceName]: {
        image: serviceName,
        ports: project.ports.map(port => `${port}:${port}`).filter(Boolean),
        restart: 'always',
        labels,
      },
    },
  }
  const composePath = `${process.cwd()}/data/project-compose/${project.id}`
  const composeKey = `db:project-compose:${project.id}`
  console.log(compose.services[serviceName])

  // await useStorage(composeKey).setItem(project.id, compose)
  return compose
}

export default defineEventHandler(async (event) => {
  try {
    // TODO change with auth

    const session = await requireAuthSession(event)
    const id = getRouterParam(event, 'id')

    if (!id)
      throw createError({ message: 'please provide an id' })

    const db = useDbStorage('projects')

    const project = await db.getItem<Project>(`${session.user?.id}:${id}`)

    const compose = await createComposeFile(project!)

    return project
  }
  catch (error) {
    console.log('invalid id or user')
  }
})
