import { Database } from 'bun:sqlite'

const tables = {
  // users table
  users: /* sql */`
CREATE TABLE IF NOT EXISTS users (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  password TEXT,
  image TEXT
);`,
  // kv table
  kv: /* sql */`
CREATE TABLE IF NOT EXISTS kv (
  key TEXT NOT NULL PRIMARY KEY,
  value TEXT
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

export const db = new DB('sqlite.db')
