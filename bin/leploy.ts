#!/usr/bin/env bun
// eslint-disable-next-line ts/ban-ts-comment
// @ts-nocheck
import * as os from 'node:os'

import { defineCommand, runMain } from 'citty'

const main = defineCommand({
  meta: {
    name: 'leploy',
    version: '0.0.1',
    description: 'A platform as a service built with bun',
  },
  args: {
    start: {
      type: 'boolean',
      description: 'Use friendly greeting',
    },
    install: { type: 'boolean', description: 'Install platform dependencies' },
  },
  async run({ args }) {
    if (args.start)
      await import('../.output/server/index.mjs')

    if (args.install)
      await import('../scripts/install.ts')
  },
})

await runMain(main)

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
