# Getting Started

From your project source code to a deployed website in few minutes.



## automated script

```bash [bash]
curl -fsSL https://github.com/daniel-le97/leploy/blob/main/scripts/install.sh | bash
```

## docker compose

```yaml [yaml]
version: '3'

services:
  proxy:
    image: 'traefik:v2.10'
    container_name: le-ploy-proxy
    command:
      - --api.insecure=true
      - --api.dashboard=true
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - '--entrypoints.web.address=:80'
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - '/var/run/docker.sock:/var/run/docker.sock:ro'
    networks:
      - le-ploy

  core:
    image: 'ghcr.io/daniel-le97/leploy:latest'
    container_name: le-ploy-core
    environment:
      - NUXT_SESSION_PASSWORD=${NUXT_SESSION_PASSWORD}:-$(openssl rand -hex 32)}
    depends_on:
      - proxy
    labels:
      - traefik.enable=true
      - traefik.http.routers.bun.rule=Host(`le-ploy.localhost`)
      - traefik.http.routers.bun.entrypoints=web
      - traefik.http.services.bun.loadbalancer.server.port=3000
      - traefik.http.services.bun.loadbalancer.server.scheme=http
    ports:
      - '3000:3000'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - le-ploy

networks:
  le-ploy:
    driver: overlay

```



## docker cli

```bash [docker]
docker run -d \
  --name le-ploy-proxy \
  --network le-ploy \
  -p 80:80 \
  -p 443:443 \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  traefik:v2.10 \
  --api.insecure=true \
  --api.dashboard=true \
  --providers.docker=true \
  --providers.docker.exposedbydefault=false \
  --entrypoints.web.address=:80
```
```bash [docker]
docker run -d \
  --name le-ploy-core \
  --network le-ploy \
  -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e NUXT_SESSION_PASSWORD=${NUXT_SESSION_PASSWORD:-$(openssl rand -hex 32)} \
  ghcr.io/daniel-le97/leploy:latest
```


<!-- ```bash [npm]
npm run dev
```

```bash [yarn]
yarn dev
```

```bash [pnpm]
pnpm run dev
``` -->


::: info
✨ Well done! A browser window should automatically open for <http://localhost:3000>
:::