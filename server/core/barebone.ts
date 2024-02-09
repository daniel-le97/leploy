import '#internal/nitro/virtual/polyfill'

const nitroApp = useNitroApp()

// @ts-expect-error H3App is App
const handler = toWebHandler(nitroApp.h3App)
export default handler
