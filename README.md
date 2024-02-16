# Leploy
a platform as a service built with [bun](https://bun.sh/) and [nuxt](https://nuxt.com)

## Local Developement

The server and client are built with nuxt allowing for full access to nuxt utilities and module ecosystem if needed
Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

### these also need to be installed currently
 - [nixpacks](https://nixpacks.com/docs)
 - [docker](https://www.docker.com/)
 - [bun](https://bun.sh/)



```bash
## install the dependencies:
bun install

## Start the development server on `http://localhost:3000`:
bun run dev

## Build the application for production:
bun run build
```

# notes

@nuxt/ui breaks builds in docker when using bun -> workaround is to build without --bun and run with bun
