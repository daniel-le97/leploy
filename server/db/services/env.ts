class ProjectEnvService {
  deleteEnv(id: string) {
    return db.prepare('DELETE FROM project_env WHERE id = ?1').run(id)
  }
  createEnv(env: ProjectEnv) {
    return db.prepare('INSERT INTO project_env (id, projectId, createdAt, updatedAt, name, value, forBuild) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)').run(
      env.id,
      env.projectId,
      env.createdAt,
      env.updatedAt,
      env.name,
      env.value,
      env.forBuild,
    )
  }

  getProjectEnvs(projectId: string) {
    return db.prepare('SELECT * FROM project_env WHERE projectId = ?1').all(projectId) as ProjectEnv[]
  }
  getProjectBuildEnvs(projectId: string) {
    return db.prepare('SELECT * FROM project_env WHERE projectId = ?1 AND forBuild = 1').all(projectId) as ProjectEnv[]
  }
}

export const projectEnvService = new ProjectEnvService()
