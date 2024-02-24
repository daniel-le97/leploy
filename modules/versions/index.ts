// `nuxt/kit` is a helper subpath import you can use when defining local modules
// that means you do not need to add `@nuxt/kit` to your project's dependencies
import { createResolver, defineNuxtModule, addServerHandler, useNitro } from 'nuxt/kit'
import {version} from '../../package.json'

export default defineNuxtModule({
  meta: {
    name: 'hello'
  },
  setup (config, nuxt) {
    nuxt.hook('ready', (nuxt) => {
        const nitro = useNitro()
        nitro.hooks.hook('compiled', () => {
            const resolved = nitro.options.output.dir
            const conf = {
                leploy: version,
                bun: Bun.version,
                nuxt: nuxt._version,
            }
            Bun.write( resolved + '/versions.json', JSON.stringify(conf, null, 2)).catch(() => {})
            
            
            
        })
    })
  }
})
