import { defu } from 'defu'
import type { SqliteProject } from '../../../types/project'

class Project {
  id: string
  name: string
  constructor(data: SqliteProject | Partial<SqliteProject>) {
    this.id = data.id!
    this.name = data.name!
  }
}

class ProjectsService {
  formatProject(partialProject: SqliteProject | Partial<SqliteProject>) {
    partialProject.https = this.formatBoolean(partialProject.https)
    partialProject.www = this.formatBoolean(partialProject.www)
    partialProject.deployed = this.formatBoolean(partialProject.deployed)
    partialProject.configured = this.formatBoolean(partialProject.configured)
    return partialProject
  }

  reverseFormatBoolean(value: number | boolean | undefined) {
    if (typeof value === 'undefined')
      return false
    if (typeof value === 'number') {
      if (value === 1)
        return true
      return false
    }

    return value
  }

  formatBoolean(value: number | boolean | undefined) {
    if (typeof value === 'undefined')
      return 0
    if (typeof value === 'boolean')
      return value ? 1 : 0

    return value
  }

  async createProject(user: string) {
    const project = {
      id: crypto.randomUUID(),
      name: generateName(),
      user,
      createdAt: Date.now(),
    }
    const transaction = db.transaction(() => {
      db.prepare('INSERT INTO projects (id, name, user, createdAt) VALUES (?1, ?2, ?3, ?4)').run(project.id, project.name, project.user, project.createdAt)
      return project.id
    })
    return await transaction() as string
  }

  async getProjectById(id: string) {
    const project = await db.prepare('SELECT * FROM projects WHERE id = ?1').get(id) as SqliteProject
    console.log(project)

    return project
  }

  async getProjectByRepoUrl(url: string) {
    return db.prepare('SELECT * FROM projects WHERE repoUrl = ?1').all(url) as SqliteProject[]
  }

  async getProjectsByUserId(userId: string) {
    return db.prepare('SELECT * FROM projects WHERE user = ?1').all(userId) as SqliteProject[]
  }

  async updateProject(id: string, partialProject: Partial<SqliteProject>) {
    // const partialProject = this.formatProject(partial)
    const found = await this.getProjectById(id)
    const merged = defu(partialProject, found)
    console.log({ found, partialProject, merged })

    const { name, deployed, configured, ports, https, www, repoUrl, startCommand, buildCommand, installCommand, buildPack } = merged
    return db
      .prepare(`
        UPDATE projects
        SET
          name = ?1,
          deployed = ?2,
          configured = ?3,
          ports = ?4,
          https = ?5,
          www = ?6,
          repoUrl = ?7,
          startCommand = ?8,
          buildCommand = ?9,
          installCommand = ?10,
          buildPack = ?11
        WHERE id = ?12
      `).run(
        name,
        deployed,
        configured,
        ports,
        https,
        www,
        repoUrl,
        startCommand,
        buildCommand,
        installCommand,
        buildPack,
        id,
      )
  }
}

export const projectsService = new ProjectsService()
