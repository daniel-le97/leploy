import type { ProjectVolume } from '../../../types/env'

class ProjectVolumesService {
  deleteVolume(id: string) {
    return db.prepare('DELETE FROM project_volumes WHERE id = ?1').run(id)
  }

  createVolume(vol: ProjectVolume) {
    return db.prepare('INSERT INTO project_volumes (id, projectId, createdAt, updatedAt, name, value) VALUES (?1, ?2, ?3, ?4, ?5, ?6)').run(
      vol.id,
      vol.projectId,
      vol.createdAt,
      vol.updatedAt,
      vol.name,
      vol.value,
    )
  }

  getProjectVolumes(projectId: string) {
    return db.prepare('SELECT * FROM project_volumes WHERE projectId = ?1').all(projectId) as ProjectVolume[]
  }
}

export const projectVolumesService = new ProjectVolumesService()
