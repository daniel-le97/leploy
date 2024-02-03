import * as os from 'node:os'
import { $ } from 'bun'

// console.log(os.tmpdir())

async function parseTar(path: string, out: string) {
  await $`mkdir -p ${out}`
  const shell = await $`tar -xzvf ${path} -C ${out}`
  return shell
}

const repoURL = 'https://github.com/daniel-le97/nitro-app-bun'

const archiveURL = `${repoURL}/archive/main.tar.gz`
const id = crypto.randomUUID()
const data = await fetch(archiveURL)
const path = `${process.cwd()}/.data/tar/${id}.tar.gz`
await Bun.write(path, data)
await parseTar(path, `./temp/${id}`)
