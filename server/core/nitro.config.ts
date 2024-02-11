import { fileURLToPath } from 'node:url'
import type { NitroPreset } from 'nitropack'

interface MyConfig {
  date: string
  preset: string
  framework: {
    name: string
    version: string
  }
  versions: {
    [key: string]: string
  }
  commands: {
    [key: string]: string
  }
}
const entry = fileURLToPath(new URL('./entry.ts', import.meta.url))
console.log('entry', entry)

export default <NitroPreset>{
  extends: 'node', // You can extend existing presets
  entry,
  exportConditions: ['bun', 'worker', 'node', 'import', 'default'],
  minify: true,
  serveStatic: true,
  commands: {
    preview: 'bun ./server/index.mjs',
  },
}
