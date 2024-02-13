export default defineNitroPlugin(async (nitroApp) => {
  const os = await import('node:os')

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0)
      return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
  }

  const stats = () => {
    return {
      freemem: formatBytes(os.freemem()),
      loadavg: os.loadavg(),
      totalmem: formatBytes(os.totalmem()),
      uptime: os.uptime(),
      dev: os.devNull,
      // hi:os.
      // usage: process.resourceUsage(),
    }
  }
  // setInterval(() => {
  //   // Server().publish('server:usage', JSON.stringify(stats()))
  //   console.log(stats());
    
  // }, 1000)
})
