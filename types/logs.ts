export interface BuildLog {
  id: string
  projectId: string
  createdAt: string // Datetime in ISO format
  data: string
  status: string
  buildTime: string
  type: string
}
