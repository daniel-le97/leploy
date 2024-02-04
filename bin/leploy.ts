#!/usr/bin/env bun
// eslint-disable-next-line ts/ban-ts-comment
// @ts-nocheck
import * as os from 'node:os'

const docker = Bun.which('docker')
const dockerCompose = Bun.which('docker-compose')
const nixpacks = Bun.which('nixpacks')
const tar = Bun.which('tar')
const git = Bun.which('git')

const items = {
  docker,
  dockerCompose,
  nixpacks,
  tar,
  git,
}
console.log(items)
console.log(process.platform)

for (const item in items) {
  if (!items[item])
    console.log(`Missing: ${item}`)
}

import('../.output/server/index.mjs')
