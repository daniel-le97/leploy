// https://nuxt.com/docs/api/configuration/nuxt-config
const dev = process.env.NODE_ENV !== 'production'
const cwd = process.cwd()

const pathFromCWD = (path: string) => `${cwd}${path}`
// these get resolved from .nuxt/tsconfig.json
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
    dirs: ['./src/types'],
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
      dirs: ['./src/server/db', './src/server/db/services', './src/types'],
    },
    storage: {
      cache: {
        driver: 'fsLite',
        base: './app-data',
      },
      db: { driver: 'fsLite', base: './app-data' },
    },
    // during production/builds, entry is resolved from the preset
    entry: dev ?  pathFromCWD('/src/server/core/entry.dev.ts') : undefined,
    preset: pathFromCWD('/src/server/core'),
    typescript: {
      tsConfig: {
        exclude,
      },
    },
  },
  modules: modules(),
})
