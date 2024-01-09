import yaml from 'yaml'

export function convertPortainerTemplatesToDockerCompose(templates: PortainerTemplate[]): string {
  const dockerComposeConfig: DockerComposeConfig = {
    version: '3',
    services: {},
  }
  const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  templates.forEach((template, index) => {
    console.log({ template })

    // if (template.type)
    //   dockerComposeConfig.version = String(template.type)

    const serviceName = `service${index + 1}`
    const service: DockerComposeService = {
      [serviceName]: {
        image: template.image,
        ports: template.ports ? [template.ports.join(':')] : undefined,
        environment: template.env
          ? template.env.map((envItem) => {
            const createEnv = (env: typeof envItem) => {
              const setDefault = env.default ? env.default : env.name.toLowerCase().includes('tz') ? defaultTimeZone : ''
              return `${env.name}=${setDefault}`
            }
            return createEnv(envItem)
          })
          : undefined,
        volumes: template.volumes
          ? template.volumes.map(volume => `${volume.bind}:${volume.container}`)
          : undefined,
        restart: template.restart_policy,
      },
    }

    Object.assign(dockerComposeConfig.services, service)
  })

  return yaml.stringify(dockerComposeConfig)
}
