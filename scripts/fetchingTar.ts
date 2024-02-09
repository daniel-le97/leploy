import { $ } from 'bun'
import { Database } from 'bun:sqlite'

// console.log(os.tmpdir())

const table = /* sql */`
CREATE TABLE IF NOT EXISTS tar (
  id TEXT NOT NULL PRIMARY KEY,
  data BLOB
);`
const db = new Database('hello.db')
db.exec(table)

async function parseTar(path: string, out: string) {
  await $`mkdir -p ${out}`
  const shell = await $`tar -xzvf ${path} -C ${out}`
  return shell
}

const repoURL = 'https://github.com/daniel-le97/nitro-app-bun'

const archiveURL = `${repoURL}/archive/main.tar.gz`
const id = crypto.randomUUID()
const data = await fetch(archiveURL)
const arr = new Uint8Array(await data.arrayBuffer())
db.prepare('INSERT INTO tar (id, data) VALUES (?1, ?2)').run(crypto.randomUUID(), arr)
const result = db.prepare('SELECT * FROM tar').get() as { id: string, data: Uint8Array }
console.log(result)
await Bun.write('hello.tar.gz', result.data)

await parseTar('hello.tar.gz', `./hello`)
