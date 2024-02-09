import { $ } from 'bun'

async function createTarGZip(source: string, target: string) {
  await $`cd ${target} && tar -czvf ./ ${source}`
}

async function parseTarGZip(source: string, target: string) {
  await $`mkdir -p ${target}`
  await $`tar -xzvf ${source} -C ${target}`
}

const source = '.output'
const target = 'archive.tar.gz'
await createTarGZip(source, target)
await parseTarGZip(target, './hello')

const file = Bun.file('archive.tar.gz')
console.log(file.size / (1024 * 1024))
