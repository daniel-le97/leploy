import { FileSystemRouter } from 'bun'

const router = new FileSystemRouter({
  dir: `${process.cwd()}/.output/public`,
  style: 'nextjs',
})

console.log(router.routes)