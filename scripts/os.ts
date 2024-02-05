import * as os from 'node:os'
import { isMainThread } from 'bun'

const constants = {
  bunMain: Bun.main,
  main: import.meta.main,
  isMainThread,
  path: import.meta.path,
}

console.log(constants)
console.log({
  home: os.homedir(),
  platform: os.platform(),
  arch: os.arch(),
  hostname: os.hostname(),
  networkInterfaces: os.networkInterfaces(),
  release: os.release(),
  type: os.type(),
  userInfo: os.userInfo(),
  version: os.version(),
  constants: os.constants,
  EOL: os.EOL,
  tmpdir: os.tmpdir(),
  endianness: os.endianness(),

})
