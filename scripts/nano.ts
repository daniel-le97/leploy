// console.log(new Date());
// const now = Date.now();
// console.log(now);
// console.log(new Date(now));
import { $ } from 'bun'

async function parseTar(path: string, out: string) {
  await $`mkdir -p ${out}`
  const shell = await $`tar -xzvf ${path} -C ${out} --strip-components=1`
  return shell
}

const cwd = process.cwd()
const repo = 'https://github.com/daniel-le97/nitro-app-bun'
const branch = 'main'
const archiveURL = `${repo}/archive/${branch}.tar.gz`
const data = (await fetch(archiveURL))
console.log(data)

const id = crypto.randomUUID()
const outfile = `${cwd}/app-data/tar/${id}.tar.gz`
await Bun.write(outfile, await data.arrayBuffer())
const shell = await parseTar(outfile, `${cwd}/temp/${id}`)
export { }
