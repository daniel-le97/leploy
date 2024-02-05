#!/usr/bin/env bun
import * as os from 'node:os'
import { $ } from 'bun'

console.log(os.homedir())

// await $`bun .output/server/index.mjs`
