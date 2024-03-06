import { Glob } from 'bun'
import { rm } from 'fs/promises'

const start = Bun.nanoseconds()
const glob = new Glob('**')
const cwd = '/Users/daniel/homelab'

function bytesToSize(bytes: number, unit = 'GB') {
  if (unit === 'MB')
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  else if (unit === 'GB')
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  else
    return 'Invalid unit'
}

const files = await Array.fromAsync(glob.scan({ dot: true, cwd }))
let count = 0
let bytes = 0
let failed = 0
for await (const filename of files) {
  const path = `${cwd}/${filename}`
  if (path.includes('final-paas'))
    continue

  count++
  const file = Bun.file(path)
  bytes += file.size
  console.log(`Removing ${path}, ${bytesToSize(file.size, 'MB')}`)
  await rm(path, { force: true })
  if (await Bun.file(path).exists()) {
    failed++
    // console.error('Failed to remove ' + path)
  }
  // process.stdout.
}
console.log(`removed ${count} files, ${bytesToSize(bytes)} in ${(Bun.nanoseconds() - start) / 1e9} seconds, ${failed} failed`)
