import { Database } from 'bun:sqlite'

const tables = {
  // users table
  'users': /* sql */`
CREATE TABLE IF NOT EXISTS users (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  password TEXT,
  image TEXT
);`,
  'docker-compose': /* sql */`
CREATE TABLE IF NOT EXISTS docker_compose (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT,
  yaml TEXT,
  compose_json TEXT,
  createdAt DATETIME,
  updatedAt DATETIME,
  userId TEXT,
  projectId TEXT,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (projectId) REFERENCES projects(id)
);`,
  'fs': /* sql */`
  CREATE TABLE IF NOT EXISTS fs (
  name TEXT NOT NULL,
  dir TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  content BLOB,
  type TEXT,
  UNIQUE (name, dir)
);`,

  'projects': /* sql */`
  CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user TEXT,
  createdAt DATETIME,
  name TEXT,
  deployed TEXT,
  configured BOOLEAN,
  buildLogs TEXT, -- Store the JSON array as a string
  ports TEXT, -- Store the JSON array as a string
  https BOOLEAN,
  www BOOLEAN,
  managed BOOLEAN,
  applicationRepoUrl TEXT,
  applicationStartCommand TEXT,
  applicationBuildCommand TEXT,
  applicationInstallCommand TEXT,
  applicationBuildPack TEXT,
  key TEXT,
  logsPath TEXT
);
`,
  // kv table
  'buildlogs': /* sql */`
CREATE TABLE IF NOT EXISTS build_logs (
  id TEXT NOT NULL PRIMARY KEY,
  data TEXT
  status TEXT,
  build_time TEXT
);`,
  // kv table

}

class DB extends Database {
  constructor(path: string) {
    super(path)
    // set wal mode directly after opening the database
    this.exec('PRAGMA journal_mode = WAL')
    // create tables if they don't exist
    Object.values(tables).map(table => this.exec(table))
  }
}

export const db = new DB('sqlite.db')
