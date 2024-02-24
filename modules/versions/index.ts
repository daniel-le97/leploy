// `nuxt/kit` is a helper subpath import you can use when defining local modules
// that means you do not need to add `@nuxt/kit` to your project's dependencies
import { createResolver, defineNuxtModule, addServerHandler, useNitro } from 'nuxt/kit'
import {version} from '../../package.json'
import {writeFile} from 'fs/promises'

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
            }
            
            writeFile( resolved + '/info.json', JSON.stringify(conf, null, 2)).catch(() => {})
            
            
            
        })
    })
  }
})
