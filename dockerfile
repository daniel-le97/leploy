# Base stage
FROM node:latest as base
WORKDIR /usr/src/app
RUN npm install -g bun

# Install dependencies into a temporary directory
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install

# Build stage
FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
RUN bun run build

# First part of the release stage (preparing dependencies and tools)
FROM oven/bun:canary-alpine as prepare_release
WORKDIR /usr/src/app
LABEL org.opencontainers.image.source https://github.com/daniel-le97/leploy
RUN apk add --no-cache bash curl git git-lfs openssh-client tar tini
COPY --from=minio/mc /usr/bin/mc /usr/bin/mc
RUN chmod +x /usr/bin/mc
# [updated at of 2/11/2024]
ARG TARGETPLATFORM
# https://download.docker.com/linux/static/stable/
ARG DOCKER_VERSION=25.0.3
# https://github.com/docker/compose/releases
ARG DOCKER_COMPOSE_VERSION=2.24.5
# https://github.com/docker/buildx/releases
ARG DOCKER_BUILDX_VERSION=0.12.1
# https://github.com/buildpacks/pack/releases
ARG PACK_VERSION=0.33.1
# https://github.com/railwayapp/nixpacks/releases
ARG NIXPACKS_VERSION=1.21.0
RUN mkdir -p ~/.docker/cli-plugins
RUN if [[ ${TARGETPLATFORM} == 'linux/amd64' ]]; then \
    curl -sSL https://github.com/docker/buildx/releases/download/v${DOCKER_BUILDX_VERSION}/buildx-v${DOCKER_BUILDX_VERSION}.linux-amd64 -o ~/.docker/cli-plugins/docker-buildx && \
    curl -sSL https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose && \
    (curl -sSL https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKER_VERSION}.tgz | tar -C /usr/bin/ --no-same-owner -xzv --strip-components=1 docker/docker) && \
    (curl -sSL https://github.com/buildpacks/pack/releases/download/v${PACK_VERSION}/pack-v${PACK_VERSION}-linux.tgz | tar -C /usr/local/bin/ --no-same-owner -xzv pack) && \
    curl -sSL https://nixpacks.com/install.sh | bash && \
    chmod +x ~/.docker/cli-plugins/docker-compose /usr/bin/docker /usr/local/bin/pack /root/.docker/cli-plugins/docker-buildx \
    ;fi
RUN if [[ ${TARGETPLATFORM} == 'linux/arm64' ]]; then \
    curl -sSL https://github.com/docker/buildx/releases/download/v${DOCKER_BUILDX_VERSION}/buildx-v${DOCKER_BUILDX_VERSION}.linux-arm64 -o ~/.docker/cli-plugins/docker-buildx && \
    curl -sSL https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-linux-aarch64 -o ~/.docker/cli-plugins/docker-compose && \
    (curl -sSL https://download.docker.com/linux/static/stable/aarch64/docker-${DOCKER_VERSION}.tgz | tar -C /usr/bin/ --no-same-owner -xzv --strip-components=1 docker/docker) && \
    (curl -sSL https://github.com/buildpacks/pack/releases/download/v${PACK_VERSION}/pack-v${PACK_VERSION}-linux-arm64.tgz | tar -C /usr/local/bin/ --no-same-owner -xzv pack) && \
    curl -sSL https://nixpacks.com/install.sh | bash && \
    chmod +x ~/.docker/cli-plugins/docker-compose /usr/bin/docker /usr/local/bin/pack /root/.docker/cli-plugins/docker-buildx \
    ;fi

# Second part of the release stage (copying files and setting up)
FROM prepare_release AS release
COPY --from=build /usr/src/app/.output/ /usr/src/app/output/
COPY --from=build /usr/src/app/app-data/ /usr/src/app/app-data/
EXPOSE 3000/tcp
CMD ["bun", "output/server/index.mjs"]
