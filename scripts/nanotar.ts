import { Glob } from "bun";
import { createTar, parseTar} from "nanotar";
const start = Bun.nanoseconds()

const glob = new Glob('**');

// const cwd = process.cwd() + '/app-data'
const cwd =  '/Users/daniel/homelab/GitHub/nuxt-elysia/final-paas/app-data/temp/98490797-8a54-43a3-ba8b-716d49850b0d'
const files = await Array.fromAsync(glob.scan({ cwd, 'dot': true }))

let arrFiles:{name:string, data:any}[] = []
for await(const file of files) {
if (file.includes('.git')) {
    continue
}
  const data = await Bun.file(cwd + '/' + file).text()
  arrFiles.push({name: file, data})
}

const data = createTar(
  arrFiles
);

// console.log(data);

const compressed = Bun.gzipSync(data)
await Bun.write('hello.tar.gz', compressed)
// const parsed = parseTar(data)
// console.log(parsed);
const decompressed = Bun.gunzipSync(compressed)
const parsed = parseTar(decompressed)
const decoder = new TextDecoder()
for await (const entry of parsed) {
    console.log(entry);
    
    // if (entry.data) {
    //     await Bun.write( process.cwd() + '/hello2/' + entry.name, decoder.decode(entry.data))
    // }
}
// console.log(parseTar(compressed));
// console.log(parsed);
const format = (number: number) => (number / (1024 * 1024)).toFixed(2)
console.log('done in ' + `${(Bun.nanoseconds() - start) / 1e9} seconds`, arrFiles.length);
// console.log('compressed size', format(compressed.length), 'MB');
// console.log('decompressed size', format(decompressed.length), 'MB');




// const hello = new CompressionStream('gzip')