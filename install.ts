#!/usr/bin/env bun
import * as os from 'node:os'
import { $ } from 'bun'

const TARGETPLATFORM = `${os.platform()}/${os.arch()}`
const DOCKER_VERSION = '25.0.2'
const DOCKER_COMPOSE_VERSION = '2.24.5'
const DOCKER_BUILDX_VERSION = '0.12.1'
const PACK_VERSION = '0.33.0'
const NIXPACKS_VERSION = '1.21.0'

await $`apk add --no-cache bash curl git git-lfs openssh-client tar tini`
await $`mkdir -p ~/.docker/cli-plugins`

if (TARGETPLATFORM === 'linux/amd64') {
  await $`curl -sSL https://github.com/docker/buildx/releases/download/v${DOCKER_BUILDX_VERSION}/buildx-v${DOCKER_BUILDX_VERSION}.linux-amd64 -o ~/.docker/cli-plugins/docker-buildx`
  await $`curl -sSL https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose`
  await $`curl -sSL https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKER_VERSION}.tgz | tar -C /usr/bin/ --no-same-owner -xzv --strip-components=1 docker/docker`
  await $`curl -sSL https://github.com/buildpacks/pack/releases/download/v${PACK_VERSION}/pack-v${PACK_VERSION}-linux.tgz | tar -C /usr/local/bin/ --no-same-owner -xzv pack`
  await $`curl -sSL https://nixpacks.com/install.sh | bash`
  await $`chmod +x ~/.docker/cli-plugins/docker-compose /usr/bin/docker /usr/local/bin/pack /root/.docker/cli-plugins/docker-buildx`
}

if (TARGETPLATFORM === 'linux/arm64') {
  await $`curl -sSL https://github.com/docker/buildx/releases/download/v${DOCKER_BUILDX_VERSION}/buildx-v${DOCKER_BUILDX_VERSION}.linux-arm64 -o ~/.docker/cli-plugins/docker-buildx`
  await $`curl -sSL https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-linux-aarch64 -o ~/.docker/cli-plugins/docker-compose`
  await $`curl -sSL https://download.docker.com/linux/static/stable/aarch64/docker-${DOCKER_VERSION}.tgz | tar -C /usr/bin/ --no-same-owner -xzv --strip-components=1 docker/docker`
  await $`curl -sSL https://github.com/buildpacks/pack/releases/download/v${PACK_VERSION}/pack-v${PACK_VERSION}-linux-arm64.tgz | tar -C /usr/local/bin/ --no-same-owner -xzv pack`
  await $`curl -sSL https://nixpacks.com/install.sh | bash`
  await $`chmod +x ~/.docker/cli-plugins/docker-compose /usr/bin/docker /usr/local/bin/pack /root/.docker/cli-plugins/docker-buildx`
}


process.exit(0)
