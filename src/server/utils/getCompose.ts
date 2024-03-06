import { createHash } from 'node:crypto'
import * as YAML from 'js-yaml'
import type { SqliteProject } from '../../types/project'

export function getDomain(project: SqliteProject) {
  return `${project.name}.${randomUUIDToBase64url(project.id)}.localhost`
}

// function takes in a crypto.randomUUID() and always returns the same character base64url string
export function randomUUIDToBase64url(uuid: string, length = 6) {
  // Create a SHA-256 hash of the UUID
  const hash = createHash('SHA512').update(uuid).digest()
  const base64url = hash.toString('base64url')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
    .substring(0, length) // Take the first 6 characters

  return base64url
}

export function getComposeFile(project: SqliteProject, domain?: string) {
  domain = domain || getDomain(project)
  const traefik = true
  const serviceName = project.name
  let labels: string[]
  let ports = project.ports.split(',')
  if (!Number(ports[0]))
    ports = ['3000']

  const envs = projectEnvService.getProjectEnvs(project.id)
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
