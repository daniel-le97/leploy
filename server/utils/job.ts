import * as fs from 'node:fs'
import * as os from 'node:os'
import * as YAML from 'js-yaml'

export class Job {
  project: SqliteProject
  needsBuild: boolean

  constructor(project: SqliteProject) {
    this.project = project
    this.needsBuild = project.buildPack !== 'compose'
  }

  getPath() {
    const temp = os.tmpdir()
    return `./temp/${this.project.id}`
  }

  cleanPath() {
    if (fs.existsSync(this.getPath()))
      fs.rmSync(this.getPath(), { recursive: true, force: true })
  }

  clone() {
    const commands = ['git', 'clone', '--depth=1', this.project.repoUrl, this.getPath()]
    console.log('running:', commands.join(' '))
    return Bun.spawn(commands, { env: this.getProjectEnv(), stdio: ['ignore', 'pipe', 'pipe'] })
  }

  build() {
    const builder = this.project.buildPack || 'nixpacks'
    const nixCommand = [`nixpacks`, `build`, `${this.getPath()}`, `--name`, `${this.project.name}`]
    console.log('running:', nixCommand.join(' '))

    return Bun.spawn(nixCommand, { env: this.getProjectEnv(), stdio: ['ignore', 'pipe', 'pipe'] })
  }

  async deploy() {
    const compose = this.createComposeFile()
    await Bun.write(`${this.getPath()}/${this.project.id}.yml`, compose)
    // return Bun.spawn(['ls'], { env: this.getProjectEnv(), stdio: ['ignore', 'pipe', 'pipe'] })
  }

  getProjectEnv() {
    const envs: Record<string, any> = {
      ...process.env,
      NIXPACKS_INSTALL_CMD: this.project.installCommand ?? undefined,
      NIXPACKS_BUILD_CMD: this.project.buildCommand ?? undefined,
      NIXPACKS_START_CMD: this.project.startCommand ?? undefined,
    }
    const projectEnvs = projectEnvService.getProjectEnvs(this.project.id)
    for (const env of projectEnvs)
      envs[env.name] = env.value

    return envs
  }

  createComposeFile(project: SqliteProject = this.project) {
    const traefik = true
    const serviceName = project.name
    let labels: string[]
    const ports = project.ports.split(',')
    const domain = 'localhost'

    const environment = Object.entries(this.getProjectEnv()).map(compose => `${compose[0]}=${compose[1]}`)

    const compose: DockerComposeConfig = {
      version: '3',
      services: {
        [serviceName]: {
          image: serviceName,
          ports: ports.map(port => `${port}:${port}`).filter(Boolean),
          restart: 'always',
          environment,
          labels: traefik
            ? [
                'traefik.enable=true',
        `traefik.http.routers.${serviceName}.rule=Host(\`${serviceName}.${domain}\`)`,
        `traefik.http.routers.${serviceName}.entrypoints=web`,
        `traefik.http.services.${serviceName}.loadbalancer.server.port=${ports[0]}`,
        `traefik.http.services.${serviceName}.loadbalancer.server.scheme=http`,
              ]
            : undefined,
        },
      },
    }
    const yaml = YAML.dump(compose)
    console.log(yaml)
    return yaml
  }
}
