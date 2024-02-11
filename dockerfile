FROM node:latest as base
WORKDIR /usr/src/app
RUN npm install -g bun

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install

# install with --production (exclude devDependencies)
# RUN mkdir -p /temp/prod
# COPY package.json bun.lockb /temp/prod/
# RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
# RUN bun test
RUN bun run build

# copy production dependencies and source code into final image
FROM oven/bun:canary-alpine as release
WORKDIR /usr/src/app
LABEL org.opencontainers.image.source https://github.com/daniel-le97/leploy
COPY --from=build /usr/src/app/.output/ /usr/src/app/output/
COPY --from=build /usr/src/app/app-data/ /usr/src/app/app-data/
RUN apk add --no-cache bash curl git git-lfs openssh-client tar tini
RUN rm -rf /usr/src/app/app-data/db

ARG TARGETPLATFORM
# https://download.docker.com/linux/static/stable/
ARG DOCKER_VERSION=24.0.7
# https://github.com/docker/compose/releases
ARG DOCKER_COMPOSE_VERSION=2.24.0
# https://github.com/docker/buildx/releases
ARG DOCKER_BUILDX_VERSION=0.12.1
# https://github.com/buildpacks/pack/releases
ARG PACK_VERSION=0.32.1
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

COPY --from=minio/mc /usr/bin/mc /usr/bin/mc
RUN chmod +x /usr/bin/mc
# RUN apk add --no-cache bash curl git git-lfs openssh-client tar tini
# RUN  bun ./scripts/install.ts
# COPY --from=minio/mc /usr/bin/mc /usr/bin/mc
# RUN chmod +x /usr/bin/mc

# run the app
# USER bun
EXPOSE 3000/tcp
CMD ["bun", "output/server/index.mjs"]
# CMD ["sh", "-c", "bun .output/server/index.mjs"]

