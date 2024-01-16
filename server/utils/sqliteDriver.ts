import { createStorage, defineDriver } from 'unstorage'

export const sqliteDriver = defineDriver(() => {
  return {
    name: 'bun-sqlite-driver',
    async hasItem(key, _opts) {
      return await db.prepare('SELECT value FROM kv WHERE key = ?1').get(key) as Promise<boolean>
    },
    async getItem(key, _opts) {
      return await db.prepare('SELECT value FROM kv WHERE key = ?1').get(key)
    },
    async setItem(key, value, _opts) {
      db.prepare('INSERT OR REPLACE INTO kv (key, value) VALUES (?1, ?2)').run(key, value)
    },
    async removeItem(key, _opts) {
      db.prepare('DELETE FROM kv WHERE key = ?1').run(key)
    },
    async getKeys(base, _opts) {
      return db.prepare(`SELECT key FROM kv WHERE key like ${base}%`).all() as string[]
    },
    async clear(base, _opts) {
      db.prepare(`DELETE FROM kv where key like ${base}%`).run()
    },

  }
})

export default sqliteDriver