class ComposeService {
  createProjectCompose(projectId: string, compose: string) {
    const id = crypto.randomUUID()
    const createdAt = Date.now().toString()
    const updatedAt = Date.now().toString()
    const json = compose
    db.prepare('INSERT INTO project_compose (id, yaml, json, projectId, createdAt, updatedAt) VALUES (?1, ?2, ?3, ?4, ?5, ?6)').run()
  }
}

export const composeService = new ComposeService()
