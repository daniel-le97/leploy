import * as fs from 'node:fs'
import * as os from 'node:os'
import * as YAML from 'js-yaml'

export class Job {
  project: SqliteProject

  constructor(project: SqliteProject) {
    this.project = project
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
    return Bun.spawn(commands, { env: this.getProjectEnv(), stdio: ['ignore', 'pipe', 'pipe'] })
  }

  build() {
    const builder = this.project.buildPack || 'nixpacks'
    const git = `git clone --depth=1 ${this.project.repoUrl} ${this.getPath()}`
    const nix= `${builder} build ${this.getPath()} --name ${this.project.name}`
    const nixCommand = [`nixpacks`, `build`, `${this.getPath()}`, `--name`, `${this.project.name}`]
    const commands = ['git', 'clone', '--depth=1', this.project.repoUrl, this.getPath(), '&&', ...nixCommand]
    
    return Bun.spawn(nixCommand, { env: this.getProjectEnv(), stdio: ['ignore', 'pipe', 'pipe'] })
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
            : undefined,
        },
      },
    }
    const yaml = YAML.dump(compose)
    console.log(yaml)
  }
}
