# Leploy
a platform as a service built with [bun](https://bun.sh/) and [nuxt](https://nuxt.com)

- automatically turn a repo into a docker image with [nixpacks](https://nixpacks.com/docs)
- supports dockerfiles and docker-compose files in the future
- automatic deployments by pointing github apps to http://localhost:3000/api/git/webhooks/:id
- leverages bun:sqlite for a blazingly fast database

## TODO
- add docker volumes for each service
- Documentation via /docs
- back ups for data
- support for portainer or caprover templates to create an "app store"
- support custom templates
- cron jobs
- install script needs work
- CLI for local and remote functionality
- support other reverse proxies? (nginx,haproxy,caddy,custom)

## Local Developement

The server and client are built with nuxt allowing for full access to nuxt utilities and module ecosystem if needed,
Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

### these also need to be installed currently
 - [nixpacks](https://nixpacks.com/docs)
 - [docker](https://www.docker.com/)
 - [bun](https://bun.sh/)
 - [nodejs](https://nodejs.org/en)

```bash
## install the dependencies:
bun install

## Start the development server on `http://localhost:3000`:
bun run dev

## Build the application for production:
bun run build
```

# notes

### these will need to be figured out before a dev enviroment container can be made
nuxt dev in docker container running with bun produces a FileNotFound error

@nuxt/ui breaks builds in docker when using bun -> workaround is to build without --bun flag
