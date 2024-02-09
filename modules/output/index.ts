import { createResolver, defineNuxtModule, addServerHandler, useNitro } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'output'
  },
  setup (config, nuxt) {
    nuxt.hook('close', () => {
        console.log('closing output module')
    
    })
  }
})