#!/usr/bin/env bun
import * as os from 'node:os'
import { $ } from 'bun'

// constants
const TARGETPLATFORM = `${os.platform()}/${os.arch()}`
const PLATFORM = os.platform()
const ARCH = os.arch()
// # https://download.docker.com/linux/static/stable/
const DOCKER_VERSION = '25.0.2'
// # https://github.com/docker/compose/releases
const DOCKER_COMPOSE_VERSION = '2.24.5'
// # https://github.com/docker/buildx/releases
const DOCKER_BUILDX_VERSION = '0.12.1'
// # https://github.com/buildpacks/pack/releases
const PACK_VERSION = '0.33.0'
// # https://github.com/railwayapp/nixpacks/releases
const NIXPACKS_VERSION = '1.21.0' // not needed for now

function ArchitectureIdentifier() {
  if (ARCH === 'x64' || ARCH === 'x86_64')
    return 'x86_64'
  else if (ARCH === 'arm64')
    return 'aarch64'
  else
    throw new Error(`Unsupported architecture:${TARGETPLATFORM}`)
}

const PACKIDENTIFIER = os.arch() === 'amd64' ? 'linux' : 'linux-arm64'

try {
  const ARCHIDENTIFIER = ArchitectureIdentifier()
  console.log('installing deps for', TARGETPLATFORM, 'using', ARCHIDENTIFIER)

  $.cwd(os.homedir())
  if (!(PLATFORM === 'darwin')) {
    await $`apk add --no-cache bash curl git git-lfs openssh-client tar tini`
    await $`mkdir -p ~/.docker/cli-plugins`
    await $`curl -sSL https://github.com/docker/buildx/releases/download/v${DOCKER_BUILDX_VERSION}/buildx-v${DOCKER_BUILDX_VERSION}.${PLATFORM}-${ARCH} -o ~/.docker/cli-plugins/docker-buildx`
    await $`curl -sSL https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-${PLATFORM}-${ARCHIDENTIFIER} -o ~/.docker/cli-plugins/docker-compose`
    await $`curl -sSL https://download.docker.com/${PLATFORM}/static/stable/${ARCHIDENTIFIER}/docker-${DOCKER_VERSION}.tgz | tar -C /usr/bin/ --no-same-owner -xzv --strip-components=1 docker/docker`
    await $`curl -sSL https://github.com/buildpacks/pack/releases/download/v${PACK_VERSION}/pack-v${PACK_VERSION}-${PACKIDENTIFIER}.tgz | tar -C /usr/local/bin/ --no-same-owner -xzv pack`
    await $`curl -sSL https://nixpacks.com/install.sh | bash`
    await $`chmod +x ~/.docker/cli-plugins/docker-compose /usr/bin/docker /usr/local/bin/pack ~/.docker/cli-plugins/docker-buildx`
  }
  // if (TARGETPLATFORM === 'linux/amd64') {
  //   await $`curl -sSL https://github.com/docker/buildx/releases/download/v${DOCKER_BUILDX_VERSION}/buildx-v${DOCKER_BUILDX_VERSION}.linux-amd64 -o ~/.docker/cli-plugins/docker-buildx`
  //   await $`curl -sSL https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose`
  //   await $`curl -sSL https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKER_VERSION}.tgz | tar -C /usr/bin/ --no-same-owner -xzv --strip-components=1 docker/docker`
  //   await $`curl -sSL https://github.com/buildpacks/pack/releases/download/v${PACK_VERSION}/pack-v${PACK_VERSION}-linux.tgz | tar -C /usr/local/bin/ --no-same-owner -xzv pack`
  //   await $`curl -sSL https://nixpacks.com/install.sh | bash`
  //   await $`chmod +x ~/.docker/cli-plugins/docker-compose /usr/bin/docker /usr/local/bin/pack /root/.docker/cli-plugins/docker-buildx`
  // }

  // if (TARGETPLATFORM === 'linux/arm64') {
  //   await $`curl -sSL https://github.com/docker/buildx/releases/download/v${DOCKER_BUILDX_VERSION}/buildx-v${DOCKER_BUILDX_VERSION}.linux-arm64 -o ~/.docker/cli-plugins/docker-buildx`
  //   await $`curl -sSL https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-linux-aarch64 -o ~/.docker/cli-plugins/docker-compose`
  //   await $`curl -sSL https://download.docker.com/linux/static/stable/aarch64/docker-${DOCKER_VERSION}.tgz | tar -C /usr/bin/ --no-same-owner -xzv --strip-components=1 docker/docker`
  //   await $`curl -sSL https://github.com/buildpacks/pack/releases/download/v${PACK_VERSION}/pack-v${PACK_VERSION}-linux-arm64.tgz | tar -C /usr/local/bin/ --no-same-owner -xzv pack`
  //   await $`curl -sSL https://nixpacks.com/install.sh | bash`
  //   await $`chmod +x ~/.docker/cli-plugins/docker-compose /usr/bin/docker /usr/local/bin/pack /root/.docker/cli-plugins/docker-buildx`
  // }
  if (import.meta.main)
    process.exit(0)
}
catch (error) {
  if (import.meta.main)
    process.exit(1)
  else console.error(error)
}
