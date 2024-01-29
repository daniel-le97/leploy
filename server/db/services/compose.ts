import * as YAML from 'js-yaml'

class ComposeService {
  createComposeFile(project: SqliteProject) {
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

export const composeService = new ComposeService()
