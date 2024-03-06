<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import YAML from 'yaml'
import type { DockerComposeConfig } from '../types/portainer'

const yaml1 = ref(`version: '3.7'
services:
  wireguard:
    image: linuxserver/wireguard
    container_name: wireguard
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/Denver
      - SERVERURL=http://localhost.com # optional
      - SERVERPORT=51820 # optional
      - PEERS=1 # optional
      - PEERDNS=auto # optional
      - INTERNAL_SUBNET=10.13.13.0 # optional
      - ALLOWEDIPS=0.0.0.0/0 # optional
    volumes:
      - /usr/share/appdata/wireguard/config:/config
      - /usr/src:/usr/src # location of kernel headers
      - /lib/modules:/lib/modules
    ports:
      - 51820:51820/udp
    sysctls:
      - net.ipv4.conf.all.src_valid_mark=1
    restart: unless-stopped
`)

const yaml2 = reactive<DockerComposeConfig>(YAML.parse(yaml1.value))
const reactiveYaml = ref(yaml1.value)

watchEffect(() => {
  yaml2.services = YAML.parse(reactiveYaml.value).services
})

watchEffect(() => {
  reactiveYaml.value = YAML.stringify(yaml2)
})

function updateEnvironmentVariable(serviceIndex: number | string, envIndex: number, newValue: EventTarget | null) {
  // @ts-expect-error it works
  yaml2.services[serviceIndex].environment[envIndex] = newValue.value
}
</script>

<template>
  <div class="w-1/2">
    <textarea v-model="reactiveYaml" class="w-full" />
  </div>
  <div class="w-1/2">
    <div v-for="(service, serviceIndex) in yaml2.services" :key="serviceIndex" class="w-full">
      Service: {{ serviceIndex }}
      Image: <input v-model="service.image" type="text">
      <div>
        <div>Variables:</div>
        <div v-for="(env, envIndex) in service.environment" :key="envIndex">
          <input :value="env" class="flex space-x-2 m-2" @input=" $event => updateEnvironmentVariable(serviceIndex, envIndex, $event.target)">
        </div>
      </div>
    </div>
  </div>
</template>
