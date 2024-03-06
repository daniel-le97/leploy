import { sql } from 'drizzle-orm'
import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

const users = sqliteTable('users', {
  id: text('id'),
  createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
  isAdmin: integer('isAdmin', { mode: 'boolean' }).notNull().default(false),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  image: text('image').notNull(),
})

const projects = sqliteTable('projects', {
  id: text('id').notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
  name: text('name').notNull(),
  deployed: int('deployed', { mode: 'boolean' }).notNull().default(false),
  containerId: text('containerId'),
  configured: int('configured', { mode: 'boolean' }).notNull().default(false),
})

const projectDetails = sqliteTable('applicationDetails', {
  projectId: text('applicationId')
    .notNull()
    .primaryKey()
    .references(() => projects.id, { onDelete: 'cascade' }),
  repoUrl: text('repoUrl'),
  startCommand: text('startCommand'),
  buildCommand: text('buildCommand'),
  installCommand: text('installCommand'),
  buildPack: text('buildPack'),
})

const buildLogs = sqliteTable('buildLogs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text('projectId')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  buildTime: text('buildTime').notNull(),
  buildDate: text('buildDate').notNull().default(sql`CURRENT_TIMESTAMP`),
  logs: text('logs'),
})

// CREATE TABLE IF NOT EXISTS projects (
//     id UUID PRIMARY KEY,
//     user_id UUID NOT NULL,
//     created_at TIMESTAMP NOT NULL,
//     name VARCHAR(255) NOT NULL,
//     deployed BOOLEAN,
//     configured BOOLEAN NOT NULL,
//     ports INTEGER ARRAY,
//     https BOOLEAN NOT NULL,
//     www BOOLEAN NOT NULL,
//     managed BOOLEAN NOT NULL,
//     key VARCHAR(255) NOT NULL,
//     logs_path VARCHAR(255) NOT NULL
// );

// CREATE TABLE IF NOT EXISTS build_logs (
//     id UUID PRIMARY KEY,
//     application_id UUID NOT NULL,
//     build_time FLOAT NOT NULL,
//     build_date TIMESTAMP NOT NULL,
//     FOREIGN KEY (application_id) REFERENCES projects(id)
// );

// CREATE TABLE IF NOT EXISTS application_details (
//     application_id UUID PRIMARY KEY,
//     repo_url VARCHAR(255),
//     start_command VARCHAR(255),
//     build_command VARCHAR(255),
//     install_command VARCHAR(255),
//     build_pack VARCHAR(255),
//     FOREIGN KEY (application_id) REFERENCES projects(id)
// );
