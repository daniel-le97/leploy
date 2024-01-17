import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const dockerComposeConfigs = sqliteTable('docker_compose_config', {
  id: integer('id').primaryKey(),
  services: text('services').notNull(),
  imageName: text('image_name').notNull(),
  containerName: text('container_name'),
  hostPort: integer('host_port'),
  containerPort: integer('container_port'),
  environmentVariables: text('environment_variables'),
  volumes: text('volumes'),
  networks: text('networks'),
})

export const compose = /* sql */ `CREATE TABLE FS`
