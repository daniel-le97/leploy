// https://nuxt.com/docs/api/configuration/nuxt-config
const dev = process.env.NODE_ENV !== 'production'
const cwd = process.cwd()

const exclude = ['../eslint.config.js', `../temp`, `../app-data`, `../.output`, 'pino-std-serializers', `../docs`]
export default defineNuxtConfig({
  ssr: false,
  // srcDir: 'src/',

  routeRules: {
    '/providers/caprover': { prerender: true },
    '/providers/portainer': { prerender: true },
  },
  typescript: {
    tsConfig: {
      exclude,
    },
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
  ignore: ['/temp', '/data', '/stack', '/app-data'],
  nitro: {
    rollupConfig: {
      external: ['bun', 'bun:sqlite'],
    },
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
        exclude,
      },
    },
  },
  // @ts-expect-error - this error is a bug in the types
  modules: ['@nuxt/ui', '@vueuse/nuxt', 'nuxt-auth-utils', dev ? 'nuxt-build-cache' : undefined].filter(Boolean),
})
