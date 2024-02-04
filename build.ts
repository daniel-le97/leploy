import { $ } from 'bun'

// await $`bun i`
// await $`bun build`
// await $`tar -czvf build.tar.gz .output`

const file = Bun.file('build.tar.gz')
const megabytes = file.size / (1024 * 1024);

console.log(`Size in Megabytes: ${megabytes} MB`);