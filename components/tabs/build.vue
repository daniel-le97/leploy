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

const logs = useBuildLogs()

const { data, pending, error, refresh } = await useFetch<BuildLog[]>(`/api/build/${routerId}/logs`)
if (data.value)
  logs.value = data.value

watch(data, (newVal) => {
  if (newVal)
    logs.value = newVal
})
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

async function handleBuildKill() {
  const { data, pending, error, refresh } = await useFetch(`/api/build/${routerId}/kill`, {
    method: 'DELETE',
  })
}

const term = ref()
const ansi = '#12 4.696 computing gzip size...\n#12 4.699 dist/<span style="font-weight:normal;text-decoration:none;font-style:normal"><span style="color:#0AA">_astro/hoisted.ec938008.js  <span style="color:#FFF"><b>8.74 kB<span style="font-weight:normal;text-decoration:none;font-style:normal"><b><span style="font-weight:normal;text-decoration:none;font-style:normal"> │ gzip: 3.01 kB<span style="font-weight:normal;text-decoration:none;font-style:normal">\n#12 4.699 <span style="color:#0A0">✓ built in 80ms<span style="color:#FFF">\n#12 4.699 Completed in 90ms.\n#12 4.699 \n#12 4.705 \n#12 4.705  generating static routes \n#12 4.803 ▶ src/pages/index.astro\n</span></span></span></span></b></span></b></span></span></span>'
</script>

<template>
  <section class="flex  flex-col items-center  justify-center w-full space-y-3 ">
    <div class="lg:flex space-x-3 w-full flex flex-row">
      <label class="block dark:text-white text-gray-700 text-3xl  font-bold mb-2" for="build-logs">
        Build Logs
      </label>
      <RippleBtn type="button" class=" font-bold py-1 bg-red-600 rounded-lg" @click="handleBuildKill">
        kill build
      </RippleBtn>
    </div>
    <UDivider class="w-full" />
    <div class=" flex  gap-2">
      <div class="w-4/5  max-w-2xl min-h-[80vh]">
        <div class=" bg-zinc-700 rounded-md h-full">
          <pre v-if="buildData.length" id="pre-build" class="w-full h-full overflow-y-auto whitespace-pre-wrap scrollable-pre text-xs"> {{ buildData }}</pre>
          <pre v-else id="pre-build" class="w-full h-full overflow-auto whitespace-pre-wrap scrollable-pre"> {{ 'no builds logged' }}</pre>
        </div>
      </div>

      <div class="w-1/5">
        <div v-if="logs.length">
          <div v-for="log in logs" :key="log.id" class="w-full flex justify-center items-center max-h-[75vh]">
            <BuildLogCard :duration="log.buildTime" :type="log.type" :status="log.status" :date="log.createdAt" :class=" activeId === log.id ? 'bg-white text-black' : ''" @click="handleClick(log)" />
          </div>
        </div>
        <div v-else>
          hello
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.scrollable-pre {
  min-height: 55vh;
  max-height: 70vh; /* Set the desired fixed height */
  overflow-y: auto; /* Enable vertical scrolling */
  border: 1px solid #ccc; /* Optional: add a border for styling */
  padding: 10px; /* Optional: add padding for better appearance */
}
</style>
