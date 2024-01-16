export interface ProjectEnv {
    id: string
    projectId: string
    createdAt: string // Assuming the date is stored as a string, you can change the type accordingly
    updatedAt: string // Assuming the date is stored as a string, you can change the type accordingly
    name: string
    value: string
    forBuild: boolean
  }
  