#!/usr/bin/env bun
// eslint-disable-next-line ts/ban-ts-comment
// @ts-nocheck
import * as os from 'node:os'
import type { ParseArgsConfig } from 'node:util'
import { parseArgs } from 'node:util'
import { $, FileSystemRouter, isMainThread, main } from 'bun'

const mains = {
  bunMain: Bun.main,
  origin: Bun.origin,
  isMainThread: Bun.isMainThread,

}

console.log(mains)

// # https://download.docker.com/linux/static/stable/
const DOCKER_VERSION = '25.0.2'

const args = Bun.argv.slice(2)
const config: ParseArgsConfig = {
  options: {
    install: {
      type: 'boolean',
      short: 'i',
    },
    serve: {
      type: 'boolean',
      short: 's',
    },
  },
  allowPositionals: true,
  strict: true,
}

const {
  values,
  positionals,
} = parseArgs({ args, options: config.options })

if (values.serve) {
  const dir = `${process.cwd()}/.output/public`
  console.log(dir);
  
  const router = new FileSystemRouter({

    directory: dir,
    // fileExtensions: ['js', 'json', 'html', 'png', 'ico', 'css', 'jpg', 'jpeg', 'svg', 'gif', 'webp', 'mp3', 'mp4', 'webm', 'ogg', 'ogv', 'avi', 'mov', 'flv', 'wmv', 'mkv', 'wav', 'flac', 'aac', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'csv', 'json', 'xml', 'zip', 'gz', 'tar', 'tgz', 'rar', '7z', 'psd', 'ai', 'eps', 'ps', 'ttf', 'eot', 'woff', 'woff2', 'otf', 'avi', 'wmv', 'mov', 'webm', 'mp4', 'm4a', 'm4v', 'mpg', 'mpeg', '3gp', '3g2', 'flv', 'mkv', 'vob', 'ogv', 'ogg', 'drc', 'gif', 'gifv', 'mng', 'avi', 'mov', 'qt', 'wmv', 'yuv', 'rm', 'rmvb', 'asf', 'amv', 'mp4', 'm4p', 'm4v', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'mpg', 'mpeg', 'm2v', 'm4v', 'svi', '3gp', '3g2', 'mxf', 'roq', 'nsv', 'flv', 'f4v', 'f4p', 'f4a', 'f4b', 'webm', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'csv', 'odg', 'odf', 'odp', 'odt', 'rtf', 'txt', 'md', 'html', 'htm', 'xhtml', 'mht', 'mhtml', 'php', 'asp', 'aspx', 'js', 'jsp', 'css', 'scss', 'less', 'sass', 'json', 'xml', 'yaml', 'yml', 'toml', 'ini', 'cfg', 'conf', 'htaccess', 'htpasswd', 'log', 'htaccess', 'htpasswd', 'htgroups'],
    style: 'nextjs',
  })
  console.log(router.routes)

  // const server = Bun.serve({
  //   fetch(request, server) {
  //     const match = router.match(request)
  //     if (match)
  //       return new Response(Bun.file(match.filePath))

  //     return new Response('Not Found', { status: 404 })
  //   },
  // })
  // console.log(`Serving on http://localhost:${server.port}`)
}

if (values.install) {
  Bun.enableANSIColors = true
  console.log('installing deps for', os.platform(), os.arch())

  let docker = Bun.which('docker')
  if (!docker) {
    $.cwd(os.homedir())
    await $`curl https://releases.rancher.com/install-docker/${DOCKER_VERSION}.sh | sh`
    docker = Bun.which('docker')
    if (!docker) {
      await $`curl https://get.docker.com | sh -s -- --version ${DOCKER_VERSION}`
      docker = Bun.which('docker')
      if (!docker) {
        console.log('Failed to install docker')
        process.exit(1)
      }
    }
  }
  $.cwd(process.cwd())
  await $`docker --version`
  await $`docker compose -f ./docker-compose.yml build`
  await $`docker compose -f ./docker-compose.yml up -d`.env()
}

// const main = defineCommand({
//   meta: { name: 'leploy', version: '0.0.1', description: 'A platform as a service built with bun' },
//   args: {
//     start: { type: 'boolean', description: 'Use friendly greeting' },
//     install: { type: 'boolean', description: 'Install platform dependencies' },
//   },
//   async run({ args }) {
//     if (args.start)
//       console.log('Hello, world!')

//     if (args.install) {
//       let docker = Bun.which('docker')
//       if (!docker) {
//         $.cwd(os.homedir())
//         await $`curl https://releases.rancher.com/install-docker/${DOCKER_VERSION}.sh | sh`
//         docker = Bun.which('docker')
//         if (!docker) {
//           await $`curl https://get.docker.com | sh -s -- --version ${DOCKER_VERSION}`
//           docker = Bun.which('docker')
//           if (!docker) {
//             console.log('Failed to install docker')
//             process.exit(1)
//           }
//         }
//       }
//       await $`docker --version`
//       await $`docker compose -f ./docker-compose.yml build`
//       await $`docker compose -f ./docker-compose.yml up -d`
//     }
//   },
// })

// await runMain(main)

// await import('../.output/server/index.mjs')

// const docker = Bun.which('docker')
// const dockerCompose = Bun.which('docker-compose')
// const nixpacks = Bun.which('nixpacks')
// const tar = Bun.which('tar')
// const git = Bun.which('git')
// const pack = Bun.which('pack')
// const bash = Bun.which('bash')

// const items = {
//   docker,
//   dockerCompose,
//   nixpacks,
//   tar,
//   git,
//   pack,
//   bash,
// }
// console.log(items)
// console.log(`${os.platform()}/${os.arch()}`)

// for (const item in items) {
//   if (!items[item])
//     console.log(`Missing: ${item}`)
// }
