<script setup lang="ts">
import type { WatchStopHandle } from 'vue'


const { data, pending, error, refresh } = await useFetch<SqliteProject[]>('/api/projects')
const pingMap = new Map<string, Timer>()

// console.log(data.value);
onMounted(() => {
  const hello = computed(() => data.value)
  watch(hello, (projects) => {
  //  console.log(projects);

  })
})

function checkIsRunning(projects: SqliteProject[]) {
  const ws = useWs()
  for (const p of projects) {
    if (p.deployed)
      ws.send(JSON.stringify({ type: 'ping', data: p.id }))
  }
}

const watching: WatchStopHandle | undefined = undefined

async function handleProjectCreate() {
  const projectId = await $fetch<string>('/api/projects', {
    method: 'POST',
  })
  await navigateTo(`/projects/${projectId}`)
}
const formattedDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format

const items = [[{
  label: 'Application',
  icon: 'i-heroicons-pencil-square-20-solid',
  // shortcuts: ['E'],
  click: handleProjectCreate,
}, {
  label: 'Database',
  icon: 'i-heroicons-document-duplicate-20-solid',
  click: () => console.log('clicked'),
  // shortcuts: ['D'],
  disabled: true,
}],
  // , [{
  //   label: 'Archive',
  //   icon: 'i-heroicons-archive-box-20-solid'
  // }, {
  //   label: 'Move',
  //   icon: 'i-heroicons-arrow-right-circle-20-solid'
  // }], [{
  //   label: 'Delete',
  //   icon: 'i-heroicons-trash-20-solid',
  //   shortcuts: ['⌘', 'D']
  // }]
]

async function deleteProject(id: string) {
  await $fetch(`/api/projects/${id}`, {
    method: 'DELETE',
  })
  await refresh()
}

// const id = useId()
</script>

<template>
  <div class="m-2 p-2 min-h-screen w-full">
    <div class="flex justify-between">
      <RippleBtn type="button" class=" font-bold py-1rounded-lg bg-white rounded text-black" @click="refresh">
        refresh
      </RippleBtn>
      <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
        <UButton color="white" label="Create Resource" trailing-icon="i-heroicons-chevron-down-20-solid" />
      </UDropdown>
    </div>
    <div v-if="data" class="flex flex-wrap justify-evenly gap-7 p-3 m-3">
      <div v-for="template in data" :key="template.name" class="group flex-shrink-0 shadow-md relative p-2 rounded-md dark:bg-zinc-800 h-full hover:dark:bg-emerald-600 hover:shadow-lg  hover:shadow-emerald-300/10 transition-all duration-150 ease-linear" style="width: calc(50% - 1.4rem); max-width: 400px;">
        <!-- Adjust width based on the total width of the container and the desired number of items per row -->
        <NuxtLink :to="`/projects/${template.id}`" class="">
          <div class="flex items-center justify-center space-x-3">
            <div class="text-xl font-bold px-4">
              {{ template.name }}
            </div>
            <span class="group-hover:translate-x-4 transition-transform duration-150 ease-linear">
              <Icon name="material-symbols:arrow-right-alt-rounded" size="25" />
            </span>
          </div>
          <!-- <UDivider class="mt-2  bg-white !text-white" /> -->
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
              <Icon name="material-symbols-light:deployed-code-outline" class="group-hover:opacity-10 transition-all duration-200 group-hover:drop-shadow-lg text-green-500   absolute -left-4 -top-4" size="50" />
              <Icon name="material-symbols-light:deployed-code" class="opacity-50 group-hover:opacity-90 group-hover:text-white transition-all duration-200 group-hover:drop-shadow-lg text-green-500   absolute -left-4 -top-4" size="50" />
            </div>
          </div>
          <!-- <div class="my-1.5 px-2 flex justify-end">
            <div class="flex gap-2">
              <a :href="template.deployed" target="_blank" rel="noopener noreferrer" v-if="template.deployed">
                <Icon name="iconamoon:link-external-duotone" class="opacity-50 group-hover:opacity-90 hover:dark:text-white/50 group-hover:text-white transition-all duration-200 group-hover:drop-shadow-lg text-green-500   " size="35" />
              </a>

              <Icon
                name="solar:trash-bin-minimalistic-bold-duotone" class="opacity-50 group-hover:opacity-90 group-hover:text-white
                hover:dark:text-white/50 transition-all duration-200 group-hover:drop-shadow-lg text-green-500" size="35"
                @click="deleteProject(template.id)"
              />
            </div>
          </div> -->
        </NuxtLink>
        <div class="my-1.5 px-2 flex justify-end">
          <div class="flex gap-2">
            <a v-if="template.deployed" :href="template.deployed" target="_blank" rel="noopener noreferrer">
              <Icon name="iconamoon:link-external-duotone" class="opacity-50 group-hover:opacity-90 hover:dark:text-white/50 group-hover:text-white transition-all duration-200 group-hover:drop-shadow-lg text-green-500   " size="35" />
            </a>

            <Icon
              name="solar:trash-bin-minimalistic-bold-duotone" class="opacity-50 group-hover:opacity-90 group-hover:text-white
                hover:dark:text-white/50 transition-all duration-200 group-hover:drop-shadow-lg text-green-500" size="35"
              @click="deleteProject(template.id)"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex justify-evenly flex-row align-middle gap-7 p-3 m-3">
      no projects to display
    </div>
  </div>
</template>
