import { fileURLToPath } from 'node:url'
import type { NitroPreset } from 'nitropack'
import { version } from '../../package.json'

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

export default <NitroPreset>{
  extends: 'node', // You can extend existing presets
  entry: fileURLToPath(new URL('./entry.ts', import.meta.url)),
  exportConditions: ['bun', 'worker', 'node', 'import', 'default'],
  minify: true,
  serveStatic: true,
  commands: {
    preview: 'bun ./server/index.mjs',
  },
}
