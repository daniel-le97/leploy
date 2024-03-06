import type { BuildLog } from '../../../../types/logs'

class LogsService {
  getLogsByProjectId(id: string) {
    return db.prepare('SELECT * FROM build_logs WHERE projectId = ?1 ORDER BY createdAt DESC').all(id) as BuildLog[]
  }

  getLatestByProjectId(id: string) {
    return db.prepare('SELECT * FROM build_logs WHERE projectId = ?1 ORDER BY createdAt DESC LIMIT 1').get(id) as BuildLog
  }

  createLogs(log: BuildLog) {
    db.prepare('INSERT INTO build_logs (id, projectId, createdAt, data, status, buildTime, type, compose, commitHash) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)').run(
      log.id,
      log.projectId,
      log.createdAt,
      log.data,
      log.status,
      log.buildTime,
      log.type,
      log.compose,
      log.commitHash,
    )
  }
}

export const logsService = new LogsService()
