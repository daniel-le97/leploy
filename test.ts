import { readdir } from 'node:fs/promises'
import * as yaml from 'yaml'
import { db } from './server/db/index'

const cwd = `${process.cwd()}/.data/templates/caprover/apps`
const number = 1000

try {
  const files = await readdir(cwd)
  for await (const file of files) {
    const fsFile = Bun.file(`${cwd}/${file}`)
    const data = await fsFile.text()
    const yamlString = yaml.stringify(await fsFile.text())
    console.log(yamlString);
    
    db.prepare(/* sql */`Insert into fs (name, dir, content, type) values (?1, ?2, ?3, ?4)`).run(file, cwd, data, 'json')
  }
}
catch (err) {
  console.error(err)
}
