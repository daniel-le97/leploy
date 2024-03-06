<script lang="ts" setup>
const props = defineProps<Template[]>()

// this component is currently unused

interface Template {
  name: string
  description: string
  logo: string
  index: number
  showFullDescription: boolean
}
</script>

<template>
  <div class="grid grid-cols-3 gap-12 items-center justify-center p-24">
    <div v-for="template in props" :key="template.name" class=" shadow-md hover:shadow-xl transition-all duration-150 ease-linear relative p-2 rounded-md bg-gray-900 h-full">
      <div class="flex  items-center justify-center space-x-4">
        <img
          :src="template.logo"
          :label="template.logo"
          height="5vh"
          class="w-16 "
        >
        <div class="text-xl font-bold px-2 pt-4">
          {{ template.name }}
        </div>
        <span class="group-hover:translate-x-4 transition-transform duration-150 ease-linear">
          <Icon name="material-symbols:arrow-right-alt-rounded" size="25" />
        </span>
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
    </div>
  </div>
</template>

<style>

</style>
