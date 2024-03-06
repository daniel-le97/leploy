// https://nuxt.com/docs/api/configuration/nuxt-config
const dev = process.env.NODE_ENV !== 'production'
const cwd = process.cwd()

const exclude = ['../eslint.config.js', `../temp`, `../app-data`, `../.output`, 'pino-std-serializers', `../docs`]
const modules = () => {
  const modules = ['@nuxt/ui', '@vueuse/nuxt', 'nuxt-auth-utils']
  if (dev) {
    modules.push('nuxt-build-cache')
  }
  return modules
}
export default defineNuxtConfig({
  ssr: false,
  srcDir: 'src/',

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
      dirs: ['./src/server/db', './src/server/db/services', './types'],
    },
    storage: {
      cache: {
        driver: 'fsLite',
        base: './app-data',
      },
      db: { driver: 'fsLite', base: './app-data' },
    },
    // set to undefined in prod so during build we use the correct entry and not the dev entry
    entry: dev ?  cwd + '/src/server/core/entry.dev.ts' : undefined,
    preset: cwd + '/src/server/core',
    typescript: {
      tsConfig: {
        exclude,
      },
    },
  },
  modules: modules(),
})
