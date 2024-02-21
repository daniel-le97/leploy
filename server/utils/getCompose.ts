import * as YAML from 'js-yaml'
import type { SqliteProject } from '../../types/project'
import {randomBytes} from 'node:crypto'



export function getRandomSubdomain(length = 6) {
  return randomBytes(length).toString('base64url')
}

export function getComposeFile(project: SqliteProject, envs: Record<string, any>, domain:string) {
  const traefik = true
  const serviceName = project.name
  let labels: string[]
  let ports = project.ports.split(',')
  if (!Number(ports[0]))
    ports = ['3000']

  const id = project.id
  const volumes = projectVolumesService.getProjectVolumes(id).map(volume => `${volume.name}:${volume.value}`)
  const environment = Object.entries(envs).filter(env => env[1]).map(compose => `${compose[0]}=${compose[1]}`)
  const label = `leploy=${id}`
  const compose: DockerComposeConfig = {
    version: '3',
    services: {
      [id]: {
        image: `${id}`,
        networks: process.dev ? undefined : ['le-ploy'],
        ports: [`${ports[0]}`],
        volumes,
        restart: 'always',
        environment,
        labels: traefik
          ? [
              'traefik.enable=true',
      `traefik.http.routers.${id}.rule=Host(\`${domain}\`)`,
      `traefik.http.routers.${id}.entrypoints=web`,
      `traefik.http.services.${id}.loadbalancer.server.port=${ports[0]}`,
      `traefik.http.services.${id}.loadbalancer.server.scheme=http`,
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
