import * as fs from 'node:fs'
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
CREATE TABLE IF NOT EXISTS project_compose (
  id TEXT NOT NULL PRIMARY KEY,
  yaml TEXT,
  json TEXT,
  createdAt DATETIME,
  updatedAt DATETIME,
  projectId TEXT,
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
  'kv': /* sql */`
  CREATE TABLE IF NOT EXISTS kv (
    key BLOB NOT NULL PRIMARY KEY,
    value BLOB
    );`,
  'project-env': /* sql */`
  CREATE TABLE IF NOT EXISTS project_env (
    id TEXT NOT NULL PRIMARY KEY,
    projectId TEXT NOT NULL REFERENCES projects(id),
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    forBuild BOOLEAN NOT NULL DEFAULT false,
    UNIQUE (name, projectId)
    );`,
  'projects': /* sql */`
  CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user TEXT NOT NULL REFERENCES users(id),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  name TEXT NOT NULL DEFAULT '',
  deployed BOOLEAN NOT NULL DEFAULT false,
  configured BOOLEAN NOT NULL DEFAULT false,
  ports TEXT NOT NULL DEFAULT '', -- Store the JSON array as a string
  https BOOLEAN NOT NULL DEFAULT false,
  www BOOLEAN NOT NULL DEFAULT false,
  repoUrl TEXT NOT NULL DEFAULT '',
  startCommand TEXT NOT NULL DEFAULT '',
  buildCommand TEXT NOT NULL DEFAULT '',
  installCommand TEXT NOT NULL DEFAULT '',
  buildPack TEXT NOT NULL DEFAULT 'nixpacks',
  buildPackHelper TEXT NOT NULL DEFAULT '',
  branch TEXT NOT NULL DEFAULT 'main'
);
`,
  'buildlogs': /* sql */`
CREATE TABLE IF NOT EXISTS build_logs (
  id TEXT NOT NULL PRIMARY KEY,
  projectId TEXT NOT NULL REFERENCES projects(id),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  data TEXT,
  status TEXT,
  buildTime TEXT,
  type TEXT NOT NULL DEFAULT 'manual'
);`,
  'queue': /* sql */`
CREATE TABLE IF NOT EXISTS queue (
  id TEXT NOT NULL PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'enqueued',
  projectId TEXT NOT NULL REFERENCES projects(id),
  logs TEXT,
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  buildTime TEXT
);`,

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

const path = `${process.cwd()}/.data/db`
if (!Bun.file(`${path}/sqlite.db`).exists())
  fs.mkdirSync(path, { recursive: true })

export const db = new DB(`${path}/sqlite.db`)
