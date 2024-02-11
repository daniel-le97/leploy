// https://nuxt.com/docs/api/configuration/nuxt-config
const dev = process.env.NODE_ENV !== 'production'
const cwd = process.cwd()
export default defineNuxtConfig({
  ssr: false,
  routeRules: {
    '/providers/caprover': { prerender: true },
    '/providers/portainer': { prerender: true },

  },
  experimental: {
    componentIslands: true,
    typedPages: true,
  },
  devtools: { enabled: true },
  imports: {
    autoImport: true,
    dirs: ['./types'],
  },
  tailwindcss: {
    quiet: true,
    addTwUtil: true,

  },
  ignore: ['/temp', '/data', '/stack'],
  nitro: {
    devStorage: {
      cache: {
        driver: 'fsLite',
        base: './app-data',
      },

    },
    experimental: {
      openAPI: true,
      typescriptBundlerResolution: true,
      // wasm: true,
    },
    imports: {
      dirs: ['./server/db', './server/db/services', './types'],
    },
    storage: {
      cache: {
        driver: 'fsLite',
        base: './app-data',
      },
      db: { driver: 'fsLite', base: './app-data' },
    },
    // set to undefined in prod so during build we use the correct entry and not the dev entry
    entry: dev ? './core/entry.dev.ts' : undefined,
    preset: './server/core',
    typescript: {
      tsConfig: {
        exclude: ['../eslint.config.js', `${cwd}/temp`, `${cwd}/data`, `${cwd}/.output`, 'pino-std-serializers'],
      },
    },
  },

  modules: ['@nuxt/ui', '@vueuse/nuxt', 'nuxt-auth-utils', 'nuxt-build-cache'],
})
