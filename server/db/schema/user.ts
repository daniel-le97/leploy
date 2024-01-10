import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

const users = sqliteTable('users', {
  id: text('id'),
  createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
  isAdmin: integer('isAdmin', { mode: 'boolean' }).notNull().default(false),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  image: text('image').notNull(),
  
})
