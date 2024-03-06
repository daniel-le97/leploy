FROM alpine:3.18

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

USER root
WORKDIR /artifacts
RUN apk add --no-cache bash curl git git-lfs openssh-client tar tini
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

# COPY --from=minio/mc /usr/bin/mc /usr/bin/mc
# RUN chmod +x /usr/bin/mc

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["tail", "-f", "/dev/null"]