function formatMemoryUsage(memoryUsage: NodeJS.MemoryUsage) {
  const bytesToSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0)
      return '0 Byte'

    // @ts-expect-error it works
    const i = Number.parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return `${Math.round((bytes / 1024 ** i))} ${sizes[i]}`
  }

  return {
    rss: bytesToSize(memoryUsage.rss),
    heapTotal: bytesToSize(memoryUsage.heapTotal),
    heapUsed: bytesToSize(memoryUsage.heapUsed),
    external: bytesToSize(memoryUsage.external),
  }
}
