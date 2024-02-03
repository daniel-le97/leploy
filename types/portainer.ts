// Base type for both types of services
export interface BaseService {
  id: string
  name: string
  type: 'docker-compose' | 'nixpacks'
  description: string
  created_at: Date
  updated_at: Date
  hasRepo?: string
}

// Type for Docker Compose services
export type ComposeService = BaseService & {
  type: 'docker-compose'
  compose_file: string // You might want to use a more specific type
  compose_version: string
}

// Type for Dockerfile-based services
export type DockerfileService = BaseService & {
  type: 'dockerfile'
  dockerfile_content: string
  build_context: string
}

// ---------------------------------------------//

export interface PortainerTemplate {
  name: string
  image: string
  env?: { default?: string, label: string, name: string, set?: string }[]
  ports?: string[]
  volumes?: { bind: string, container: string }[]
  restart_policy?: string
  type: number
}

export interface DockerComposeService {
  [key: string]: {
    image: string
    ports?: string[]
    environment?: string[]
    volumes?: string[]
    restart?: string
    labels?: string[]
    networks?: string[]
  }
}

export interface DockerComposeConfig {
  version?: string
  services: DockerComposeService
  networks?: { [key: string]: { external: boolean } }
}

// ---------------------------------------------//

export interface ITemplate {
  name: string
  description: string
  logo: string
  index: number
  showFullDescription: boolean
}
export interface IPortainer extends PortainerTemplate {
  description: string
  logo: string
  name: string
  title: string
  repository: {
    stackfile: string
    url: string
  }
}
export interface ITemplateFile { version: string, templates: IPortainer[] }
