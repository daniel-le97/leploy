import YAML from 'yaml'

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

async function createComposeFile(project: ProcessProject | Project) {
  const traefik = project.managed
  const https = project.https
  const serviceName = project.name
  let labels: string[]
  // if (traefik) {
  //   labels = [
  //     'traefik.enable=true',
  //     `traefik.http.routers.${serviceName}.rule=Host(${serviceName}.localhost)`,
  //     `traefik.http.routers.${serviceName}.entrypoints=web`,
  //     `traefik.http.services.${serviceName}.loadbalancer.server.port=${project.ports[0]}`,
  //     `traefik.http.services.${serviceName}.loadbalancer.server.scheme=http`,
  //   ]
  // }
  // else {
  //   labels = []
  // }

  const networks = traefik ? { 'nux-sailor-proxy': { external: true } } : undefined

  const compose: DockerComposeConfig = {
    version: '3',
    networks,
    services: {
      [serviceName]: {
        image: serviceName,
        ports: project.ports.map(port => `${port}:${port}`).filter(Boolean),
        restart: 'always',
        networks: traefik ? ['nux-sailor-proxy'] : undefined,
        labels: traefik
          ? [
              'traefik.enable=true',
      `traefik.http.routers.${serviceName}.rule=Host(\`${serviceName}.localhost\`)`,
      `traefik.http.routers.${serviceName}.entrypoints=${traefik && https ? 'websecure' : 'web'}`,
      `traefik.http.services.${serviceName}.loadbalancer.server.port=${project.ports[0]}`,
      `traefik.http.services.${serviceName}.loadbalancer.server.scheme=${traefik && https ? 'https' : 'http'}`,
            ]
          : undefined,
      },

    },
  }
  return YAML.stringify(compose)
}
// const composePath = `${process.cwd()}/data/project-compose/${project.id}`
// const composeKey = `db:project-compose:${project.id}`
// console.log(compose.services[serviceName])

// await useStorage(composeKey).setItem(project.id, compose)

export default defineEventHandler(async (event) => {
  try {
    // TODO change with auth

    const session = await requireAuthSession(event)
    const id = getRouterParam(event, 'id')

    if (!id)
      throw createError({ message: 'please provide an id' })

    const db = useDbStorage('projects')

    const project = await db.getItem<Project>(`${session.id}:${id}`)

    const compose = await createComposeFile(project!)

    return compose
  }
  catch (error) {
    console.log('invalid id or user')
  }
})
