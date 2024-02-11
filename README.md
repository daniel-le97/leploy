# Leploy
a platform as a service built [bun](https://bun.sh/) and [nuxt](https://nuxt.com)

## Local Developement

The server and client are built with nuxt allowing for full access to nuxt utilities and module ecosystem if needed
Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

```bash
## make sure bun is installed
npm i -g bun
##    or
curl -fsSL https://bun.sh/install | bash

## install the dependencies:
bun install

## Start the development server on `http://localhost:3000`:
bun run dev

## Build the application for production:
bun run build
```

# notes

@nuxt/ui breaks builds in docker when using bun -> workaround is just bundle with node and run with bun
