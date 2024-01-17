<script setup lang="ts">
import type { ITemplate } from '../../../types/portainer'

const { data: templates } = await useFetch<ITemplate[]>('/api/providers/portainer/templates')
// console.log(templates)
function toggleDescription(template: any) {
  template.showFullDescription = !template.showFullDescription
}
</script>

<template>
  <div class="grid grid-cols-3 gap-12 items-center justify-center p-24">
    <div v-for="template in templates" :key="template.name" class="group shadow-md relative p-2 rounded-md dark:bg-gray-900 h-full hover:shadow-xl transition-all duration-150 ease-linear">
      <NuxtLink :to="`/providers/portainer/${template.name}`">
        <div class="flex    items-center justify-center space-x-3">
          <img
            fallback="/docker-compose.png"
            :src="template.logo"
            height="5vh"
            class="w-16 "
            @error="() => (template.logo = '/docker-compose.png')"
          >
          <div class="text-xl font-bold ">
            {{ template.name }}
          </div>
          <span class="group-hover:translate-x-4 transition-transform duration-150 ease-linear">
            <Icon name="material-symbols:arrow-right-alt-rounded" size="25" />
          </span>
          <!-- </nuxtimg> -->
        </div>
        <UDivider class="mt-2" />
        <div class="p-2">
          <template v-if="template.description?.length >= 240">
            <div v-if="!template?.showFullDescription" class="truncate">
              {{ `${template?.description?.slice(0, 240)}...` }}
            </div>
            <div v-else>
              {{ template.description }}
            </div>
            <button class="text-primary" @click="toggleDescription(template)">
              {{ template?.showFullDescription ? 'Show less' : 'Show more' }}
            </button>
          </template>
          <template v-else>
            {{ template?.description }}
          </template>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
/* Add your component-specific styles here */
</style>
