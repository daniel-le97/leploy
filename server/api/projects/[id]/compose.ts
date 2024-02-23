interface DockerComposeConfig {
  version: string
  services: {
    [serviceName: string]: DockerServiceConfig
  }
  volumes?: {
    [volumeName: string]: string | { driver: string, driver_opts?: Record<string, string> }
  }
  networks?: {
    [networkName: string]: DockerNetworkConfig
  }
}

interface DockerServiceConfig {
  image?: string
  build?: string | { context: string, dockerfile: string }
  ports?: string[]
  labels?: string[]
  environment?: string[]
  volumes?: (string | { source: string, target: string })[]
  networks?: string[] | { [networkName: string]: DockerServiceNetworkConfig }
  depends_on?: string[]
  command?: string | string[]
  restart?: 'no' | 'always' | 'unless-stopped'
  // Add other service-specific configurations as needed
}

interface DockerNetworkConfig {
  driver?: string
  driver_opts?: Record<string, string>
  external?: boolean
}

interface DockerServiceNetworkConfig {
  aliases?: string[]
  ipv4_address?: string
  ipv6_address?: string
}

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuthSession(event)
    const id = getRouterParam(event, 'id')

    if (!id)
      throw createError({ message: 'please provide an id' })

    const db = useDbStorage('projects')

    // const project = await db.getItem<Project>(`${session.id}:${id}`)
    const project = await projectsService.getProjectById(id)
    if (!project) {
      throw createError({ message: 'project not found' })
    }


    const compose = getComposeFile(project)
    return compose

    // throw NOTIMPLEMENTED
  }
  catch (error) {
    console.log('invalid id or user')
  }
})
