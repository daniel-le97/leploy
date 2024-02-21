import { $ } from 'bun'
const start = Bun.nanoseconds()
async function createTarGZip(source: string, target: string) {
  await $`tar -czvf ${target} ${source}`
}

async function parseTarGZip(source: string, target: string) {
  await $`mkdir -p ${target}`
  await $`tar -xzvf ${source} -C ${target}`
}

const source = 'app-data'
const target = 'archive.tar.gz'
await createTarGZip(source, target)

await parseTarGZip(target, './hello')

console.log('done in ' + `${(Bun.nanoseconds() - start) / 1e9} seconds`);
// const file = Bun.file('archive.tar.gz')
// console.log(file.size / (1024 * 1024))
