import * as fs from 'node:fs'
import * as YAML from 'js-yaml'
import type { SqliteProject } from '../../types/project'

export class QueueHelper {
  project: SqliteProject

  constructor(project: SqliteProject) {
    this.project = project
  }

  getPath() {
    return `./temp/${this.project.id}`
  }

  cleanPath() {
    return fs.rmSync(this.getPath(), { recursive: true, force: true })
  }

  async createComposeFile(project: SqliteProject) {
    const traefik = true
    const serviceName = project.name
    let labels: string[]
    const ports = project.ports.split(',')
    const domain = 'localhost'

    const compose: DockerComposeConfig = {
      version: '3',
      services: {
        [serviceName]: {
          image: serviceName,
          ports: ports.map(port => `${port}:${port}`).filter(Boolean),
          restart: 'always',
          labels: traefik
            ? [
                'traefik.enable=true',
        `traefik.http.routers.${serviceName}.rule=Host(\`${serviceName}.${domain}\`)`,
        `traefik.http.routers.${serviceName}.entrypoints=web`,
        `traefik.http.services.${serviceName}.loadbalancer.server.port=${ports[0]}`,
        `traefik.http.services.${serviceName}.loadbalancer.server.scheme=http`,
              ]
            : [],
        },
      },
    }
    const yaml = YAML.dump(compose)
    console.log(yaml)
  }
}
