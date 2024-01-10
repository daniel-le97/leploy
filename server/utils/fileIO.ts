import type { Stats } from 'node:fs'
import { readdir, rm, unlink } from 'node:fs/promises'
import { existsSync, promises as fsp } from 'node:fs'
import { join, resolve } from 'node:path'
import anymatch from 'anymatch'
import { createStorage, defineDriver } from 'unstorage'

export interface FSStorageOptions {
  base?: string
  ignore?: (path: string) => boolean
  readOnly?: boolean
  noClear?: boolean
}

const PATH_TRAVERSE_RE = /\.\.\:|\.\.$/

const DRIVER_NAME = 'fs-lite'

// @ts-expect-error it works
export const bunDriver = defineDriver((opts: FSStorageOptions) => {
  if (!opts.base)
    throw new Error(DRIVER_NAME)

  opts.base = resolve(opts.base)
  const r = (key: string) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
      )
    }
    const resolved = join(opts.base!, key.replace(/:/g, '/'))
    return resolved
  }

  return {
    name: DRIVER_NAME,
    options: opts,
    async hasItem(key) {
      return await Bun.file(r(key)).exists()
    },
   async getItem(key) {
      return await Bun.file(r(key)).json()
    },
    getItemRaw(key) {
      return Bun.file(r(key))
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await fsp
        .stat(r(key))
        .catch(() => ({}) as Stats)
      return { atime, mtime, size, birthtime, ctime }
    },
    async setItem(key, value) {
      if (opts.readOnly)
        return

      return await Bun.write(r(key), JSON.stringify(value))
    },
    async setItemRaw(key, value) {
      if (opts.readOnly)
        return

      return await Bun.write(r(key), value)
    },
    async removeItem(key) {
      if (opts.readOnly)
        return

      return await unlink(r(key))
    },
    async getKeys() {
      return await readdir(r('.'))
    },
    async clear() {
      if (opts.readOnly || opts.noClear)
        return

      await rm(r('.'), { recursive: true, force: true })
    },
  }
})
