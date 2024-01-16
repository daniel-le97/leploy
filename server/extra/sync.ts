// import { readdir } from 'node:fs/promises'
// import { db } from './server/db/index'
// const cwd = `${process.cwd()}/.test`
// const files = db.prepare(/* sql */`Select * from fs`).all() as { name: string, dir: string, content: string, type: string, createdAt: string, updatedAt: string }[]
// for await (const file of files)
//   await Bun.write(`${cwd}/${file.name}`, file.content)

// const files = await readdir('./.data', { recursive: true, withFileTypes: true })
// const cwd = `${process.cwd()}/.data`
// for await (const file of files) {
//   if (file.isFile()) {
//     console.log(file.name)
//     const _file = Bun.file(`${cwd}/${file.name}`)
//     const blob = _file.stream()
//     const stream = await Bun.readableStreamToArrayBuffer(blob)
//     const Uint = new Uint8Array(stream)
//     // console.log(Uint);

//     const execute = db.prepare(/* sql */`Insert into fs (name, dir, content, type) values (?1, ?2, ?3, ?4)`)
//       .run(file.name, cwd, Uint, _file.type)
//   }
// }
