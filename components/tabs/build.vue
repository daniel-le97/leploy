<script lang="ts" setup>
import type { WatchStopHandle } from 'vue'
import type { BuildLog } from '../../types/logs'

const buildData = useBuildSSE()

interface EventWatch {
  [key: string]: WatchStopHandle | null
}

const Logs = useActiveProject()

const defaults: EventWatch = {}

const activeId = useState('active-log-id')

const routerId = useRoute('projects-id').params.id

const { data, pending, error, refresh } = await useFetch<BuildLog[]>(`/api/build/${routerId}/logs`)

// async function getLogs(id: string) {
// //  console.log(id);
//   activeId.value = id
//   const { data, pending, error, refresh } = await useFetch(`/api/build/${routerId}/logs/${id}`)
//   // console.log(data.value);

//   buildData.value = data.value as string
// }

async function handleClick(log: BuildLog) {
  buildData.value = log.data
}
</script>

<template>
  <section class="flex  flex-col items-center  justify-center w-full space-y-3 ">
    <div class="lg:flex space-x-3 w-full">
      <label class="block dark:text-white text-gray-700 text-3xl  font-bold mb-2" for="build-logs">
        Build Logs
      </label>
      <!-- <UButton type="button" class=" font-bold py-1" @click="handleClick">
        makeshift build
      </UButton> -->
      <UTooltip>
        <UIcon name="uil:rocket" class="text-2xl" />
        <template #text>
          <span class="italic">Hello World!</span>
        </template>
      </UTooltip>
    </div>
    <UDivider class="w-full" />
    <div class=" flex  gap-2">
      <div class="w-4/5  max-w-2xl min-w-[42rem]">
        <div class=" bg-zinc-700 rounded-md">
          <pre v-if="buildData.length" id="pre-build" class="w-full h-full overflow-y-auto whitespace-pre-wrap scrollable-pre"> {{ buildData }}</pre>
          <pre v-else id="pre-build" class="w-full h-full overflow-auto whitespace-pre-wrap scrollable-pre"> {{ 'no builds logged' }}</pre>
        </div>
      </div>

      <div v-if="data?.length" class="w-1/5">
        <div v-for="logs in data" :key="logs.id" class="w-full flex justify-center items-center">
          <BuildLogCard :duration="logs.buildTime" :type="logs.type" :date="logs.createdAt" :class=" activeId === logs.id ? 'bg-white text-black' : ''" @click="handleClick(logs)" />
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.scrollable-pre {
  min-height: 55vh;
  max-height: 500px; /* Set the desired fixed height */
  overflow-y: auto; /* Enable vertical scrolling */
  border: 1px solid #ccc; /* Optional: add a border for styling */
  padding: 10px; /* Optional: add padding for better appearance */
}
</style>
