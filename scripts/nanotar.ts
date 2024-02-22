import { Glob } from "bun";
import { createTar, parseTar} from "nanotar";
// import * as path from 'path'

// const args = process.argv.slice(2);
// console.log(args);


const start = Bun.nanoseconds()

const getTime = () => (Bun.nanoseconds() - start) / 1e9


const glob = new Glob('**');

// const joined = path.join(process.cwd(), './app-data')
// console.log(joined);


const cwd = process.cwd() + '/app-data'
// const cwd =  '/Users/daniel/homelab/GitHub/nuxt-elysia/final-paas/app-data/temp/98490797-8a54-43a3-ba8b-716d49850b0d'
const files = await Array.fromAsync(glob.scan({ cwd, 'dot': true , 'followSymlinks': true}))

console.log('retreived files in ' + `${getTime()} seconds`);

// const promises = Promise.all()

let arrFiles:{name:string, data:any}[] = []
for await(const file of files) {
if (file.includes('.git')) {
    continue
}
  const data = await Bun.file(cwd + '/' + file).arrayBuffer()
  arrFiles.push({name: file, data})
}


const data = createTar(
  arrFiles
);

console.log('created tar in ' + `${getTime()} seconds`);

const compressed = Bun.gzipSync(data, {'level': 5})
console.log('compressed tar in ' + `${getTime()} seconds`);
await Bun.write('hello.tar.gz', compressed)
console.log('wrote tar in ' + `${getTime()} seconds`);
const decompressed = Bun.gunzipSync(compressed)
const parsed = parseTar(decompressed)
console.log('parsed tar in ' + `${getTime()} seconds`);

// const promises = parsed.map(async(entry) => {
//   if (entry.data) {
//     console.log(entry.name);
    
//     await Bun.write(process.cwd() + '/hello/' + entry.name, entry.data)
//   }
// })
// await Promise.all(promises)

for await (const entry of parsed) {
  console.log(entry.name);
  
  if (entry.data) {
    await Bun.write(process.cwd() + '/hello/' + entry.name, entry.data)
  }

  // // const data = await entry.buffer()
  // // console.log(data.toString())
  
}

// const decoder = new TextDecoder()

const format = (number: number) => (number / (1024 * 1024)).toFixed(2)
console.log('compressed size', format(compressed.byteLength), 'MB');
console.log('uncompressed size', format(data.length), 'MB');
console.log('done in ' + `${getTime()} seconds`, arrFiles.length);

// console.log('decompressed size', format(decompressed.length), 'MB');
