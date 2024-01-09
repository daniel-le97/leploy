<script lang="ts" setup>
interface Projects {
  project: Project
}
const props = defineProps<Projects>()
</script>

<template>
  <NuxtLink :to="`/projects/${props.project.id}`">
    <div class="flex    items-center justify-center space-x-3">
      <!-- <img
        :src="getUrl(template.logoUrl)"
        height="5vh"
        class="w-16 "
      > -->
      <div class="text-xl font-bold ">
        {{ props.project.name }}
      </div>
      <span class="group-hover:translate-x-4 transition-transform duration-150 ease-linear">
        <Icon name="material-symbols:arrow-right-alt-rounded" size="25" />
      </span>
    </div>
    <UDivider class="mt-2" />
    <div class="p-2">
      {{ props.project.createdAt }}
    </div>
  </NuxtLink>
</template>

<style>

</style>
