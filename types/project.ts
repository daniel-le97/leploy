export interface Project {
  id: string
  user: string // Assuming body.user is a string, adjust the type accordingly
  createdAt: string
  name: string
  deployed?: string
  configured: boolean
  composePath?: {
    path: string
    key: string
  }
  https: boolean
  www: boolean
  application: Application// Adjust the type based on the actual structure of the project property
  buildsLogs: Logs[] // Adjust the type based on the actual structure of the buildsLogs property
  ports: string[]
  managed: boolean
}

interface Application {
  repoUrl: string
  buildPack: 'nixpacks' | 'dockerfile' | 'docker-compose'
  buildCommand: string
  installCommand: string
  startCommand: string

}

interface Logs {
  id: string
  buildTime: number
  date: Date
}

export interface ProcessProject extends Project {
  key: string
  logsPath: string
}

export interface Listener {
  projectId: string
  userId?: string
  send: (callback: (id: number) => any) => void
  close: () => void
}
