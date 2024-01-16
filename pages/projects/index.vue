<script setup lang="ts">
import type { SqliteProject } from '../../types/project'

const { data, pending, error, refresh } = await useFetch<SqliteProject[]>('/api/projects')

async function handleProjectCreate() {
  const projectId = await $fetch<string>('/api/projects', {
    method: 'POST',
  })
  // const activeProject = useActiveProject()
  // activeProject.value = project
  // console.log('activeProject', project)

  await navigateTo(`/projects/${projectId}`)
  // execute()
}
const formattedDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format
</script>

<template>
  <div class="m-2 p-2 min-h-screen w-full">
    <div class="flex justify-end">
      <UButton @click="handleProjectCreate">
        Create +
      </UButton>
    </div>
    <div v-if="data" class="flex flex-wrap justify-evenly gap-7 p-3 m-3">
      <div v-for="template in data" :key="template.name" class="group flex-shrink-0 shadow-md relative p-2 rounded-md dark:bg-gray-900 h-full hover:shadow-xl transition-all duration-150 ease-linear" style="width: calc(50% - 1.4rem); max-width: 400px;">
        <!-- Adjust width based on the total width of the container and the desired number of items per row -->
        <NuxtLink :to="`/projects/${template.id}`">
          <div class="flex items-center justify-center space-x-3">
            <div class="text-xl font-bold">
              {{ template.name }}
            </div>
            <span class="group-hover:translate-x-4 transition-transform duration-150 ease-linear">
              <Icon name="material-symbols:arrow-right-alt-rounded" size="25" />
            </span>
          </div>
          <UDivider class="mt-2" />
          <div class="p-2 flex justify-between">
            <div>
              {{ formattedDate(new Date(template.createdAt)) }}
            </div>
            <div>
              {{ useTimeAgo(new Date(template.createdAt)).value }}
            </div>
            <div>
              <!-- {{ template }}
            </div> -->
              <Icon name="material-symbols-light:deployed-code-outline" class="text-green-500" size="25" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
    <div v-else class="flex justify-evenly flex-row align-middle gap-7 p-3 m-3">
      no projects to display
    </div>
  </div>
</template>
