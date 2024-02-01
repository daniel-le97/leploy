import * as fs from 'node:fs'
import * as os from 'node:os'
import * as YAML from 'js-yaml'
import { $ } from 'bun'

async function parseTar(path: string, out: string) {
  await $`mkdir -p ${out}`
  const shell = await $`tar -xzvf ${path} -C ${out}`
  return shell
}

export class Job {
  project: SqliteProject
  needsBuild: boolean
  id = crypto.randomUUID()

  constructor(project: SqliteProject) {
    this.project = project
    this.needsBuild = !project.buildPack.includes('compose')
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
    const branch = 'main'
    const commands = ['git', 'clone', '--depth=1', '--shallow-submodules', `--branch=${branch}`, `${this.project.repoUrl}.git`, this.getPath()]
    console.log('running:', commands.join(' '))
    return Bun.spawn(commands, { env: this.getProjectEnv(), stdio: ['ignore', 'pipe', 'pipe'] })
  }

  build() {
    let commands: string[] = []
    const builder = this.project.buildPack || 'nixpacks'
    if (builder === 'nixpacks')
      commands = [`nixpacks`, `build`, this.getPath(), `--name`, `${this.project.id}`]

    if (builder === 'dockerfile')
      commands = [`docker`, `build`, `-t`, `${this.project.id}`, this.getPath()]

    if (builder === 'docker-compose')
      commands = ['docker', 'compose', '-f', this.getPath(), 'build']

    console.log('running:', commands.join(' '))

    return Bun.spawn(commands, { env: this.getProjectEnv(), stdio: ['ignore', 'pipe', 'pipe'] })
  }

  async deploy() {
    const compose = this.createComposeFile()
    const path = `${this.getPath()}/docker-compose.yml`
    await Bun.write(path, compose)
    const commands = ['docker', 'compose', '-f', path, 'up', '-d']
    return Bun.spawn(commands, { env: this.getProjectEnv(), stdio: ['ignore', 'pipe', 'pipe'] })
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

    const environment = Object.entries(this.getProjectEnv()).filter(env => env[1]).map(compose => `${compose[0]}=${compose[1]}`)

    const compose: DockerComposeConfig = {
      version: '3',
      services: {
        [serviceName]: {
          image: `${this.project.id}`,
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
