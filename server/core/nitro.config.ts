import { fileURLToPath } from 'node:url'
import type { NitroPreset } from 'nitropack'
import { version } from '../../package.json'
export default <NitroPreset>{
  extends: 'node', // You can extend existing presets
  entry: fileURLToPath(new URL('./barebone.ts', import.meta.url)),
  exportConditions: ['bun', 'worker', 'node', 'import', 'default'],
  output: {
    dir: './dist',
  },
  minify: true,
  serveStatic: true,
  commands: {
    preview: 'bun ./server/index.mjs',
  },
}
