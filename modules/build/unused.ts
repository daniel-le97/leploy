// `nuxt/kit` is a helper subpath import you can use when defining local modules
// that means you do not need to add `@nuxt/kit` to your project's dependencies
import { defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'build-bun',
  },
  async setup(options, nuxt) {
    // add bun shebang to output to allow for direct execution
    nuxt.hook('close', async () => {
      const text = `#!/usr/bin/env bun\n${await Bun.file('.output/server/index.mjs').text()}`
      await Bun.write('.output/server/index.mjs', text)
    })
  },
})
