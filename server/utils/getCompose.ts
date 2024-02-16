import * as YAML from 'js-yaml'
import type { SqliteProject } from '../../types/project'

export function getComposeFile(project: SqliteProject, envs: Record<string, any>) {
  const traefik = true
  const serviceName = project.name
  let labels: string[]
  let ports = project.ports.split(',')
  if (!ports[0])
    ports = ['3000']

  const domain = 'localhost'
  const environment = Object.entries(envs).filter(env => env[1]).map(compose => `${compose[0]}=${compose[1]}`)
  const label = `leploy=${project.id}`
  const compose: DockerComposeConfig = {
    version: '3',
    services: {
      [serviceName]: {
        image: `${project.id}`,

        networks: process.dev ? undefined : ['le-ploy'],
        ports: [`${ports[0]}`],
        restart: 'always',
        environment,
        labels: traefik
          ? [
              'traefik.enable=true',
      `traefik.http.routers.${serviceName}.rule=Host(\`${project.name}.${domain}\`)`,
      `traefik.http.routers.${serviceName}.entrypoints=web`,
      `traefik.http.services.${serviceName}.loadbalancer.server.port=${ports[0]}`,
      `traefik.http.services.${serviceName}.loadbalancer.server.scheme=http`,
      label,
            ]
          : undefined,
      },
    },
    networks: process.dev
      ? undefined
      : {
          'le-ploy': {
            external: true,
          },
        },

  }

  const yaml = YAML.dump(compose)
  return yaml
}
