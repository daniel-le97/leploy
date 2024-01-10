import '#internal/nitro/virtual/polyfill'

const nitroApp = useNitroApp()

type numString = string | number

async function cli() {
  const url = process.argv[2] || '/'
  console.log(process.argv)

  const debug = (label: numString, ...args: numString[]) => console.debug(`> ${label}:`, ...args)
  const r = await nitroApp.localCall({ url, body: { email: 'test@gmail.com', password: 'password' } })

  debug('URL', url)
  debug('StatusCode', r.status)
  debug('StatusMessage', r.statusText)

  //   for (const header of r.headers.entries()) {
  //     debug(header[0], header[1]);
  //   }
  console.log('\n', r)
}

cli().catch((err) => {
  console.error(err)

  process.exit(1)
})
