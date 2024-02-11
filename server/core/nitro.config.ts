import { $ } from 'bun'
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
  entry: Bun.fileURLToPath(new URL('./barebone.ts', import.meta.url)),
  exportConditions: ['bun', 'worker', 'node', 'import', 'default'],
  minify: true,
  serveStatic: true,
  commands: {
    preview: 'bun ./server/index.mjs',
  },
  hooks: {
    close: async () => {
      const dir = `${process.cwd()}/.output/nitro.json`
      const data = await Bun.file(dir).json() as MyConfig
      data.versions.bun = `${Bun.version}:${Bun.revision}`
      data.versions.leploy = `${version}:${(await $`git rev-parse HEAD`.text())}`
      await Bun.write(dir, JSON.stringify(data))
    },
  },
}
