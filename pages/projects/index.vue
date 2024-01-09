<script setup lang="ts">
const { data, pending, error, refresh } = await useFetch<Project[]>('/api/projects')

async function handleProjectCreate() {
  const project = await $fetch<Project>('/api/projects', {
    method: 'POST',
    body: {
      user: 'me',
    },
  })
  const activeProject = useActiveProject()
  activeProject.value = project

  await navigateTo(`/projects/${project.id}`)
  // execute()
}
</script>

<template>
  <div class="m-2 p-2 ">
    <div class="flex justify-end">
      <UButton @click="handleProjectCreate">
        Create +
      </UButton>
    </div>
    <div v-if="data" class="flex justify-evenly flex-row align-middle gap-7 p-3 m-3">
      <div v-for="template in data" :key="template.name" class="group shadow-md relative p-2 rounded-md dark:bg-gray-900 h-full hover:shadow-xl transition-all duration-150 ease-linear">
        <NuxtLink :to="`/projects/${template.id}`">
          <div class="flex    items-center justify-center space-x-3">
            <div class="text-xl font-bold ">
              {{ template.name }}
            </div>
            <span class="group-hover:translate-x-4 transition-transform duration-150 ease-linear">
              <Icon name="material-symbols:arrow-right-alt-rounded" size="25" />
            </span>
          </div>
          <UDivider class="mt-2" />
          <div class="p-2 flex justify-between">
            <div>
              {{ template.createdAt }}
            </div>
            <Icon name="material-symbols-light:deployed-code-outline" class="text-green-500" size="25" />
          </div>
        </NuxtLink>
      </div>
    </div>
    <div v-else class="flex justify-evenly flex-row align-middle gap-7 p-3 m-3">
      no projects to display
    </div>
  </div>
</template>
