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
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & build
# RUN bun test
# RUN bun run build

# copy production dependencies and source code into final image
FROM oven/bun:canary-alpine
LABEL org.opencontainers.image.source https://github.com/daniel-le97/leploy
COPY --from=prerelease /usr/src/app/.output/ ./.output/
COPY --from=prerelease /usr/src/app/.data/ ./.data/
# COPY --from=prerelease /usr/src/app/cli ./cli
# RUN ./cli
COPY --from=prerelease /usr/src/app/scripts/install.ts ./scripts/install.ts
RUN  bun ./scripts/install.ts
COPY --from=minio/mc /usr/bin/mc /usr/bin/mc
RUN chmod +x /usr/bin/mc

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["bun .output/server/index.mjs"]
