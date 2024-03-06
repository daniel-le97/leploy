<script lang="ts" setup>
const buildData = useBuildSSE()
const activeId = useState('active-log-id')
const routerId = useRoute('projects-id').params.id
const logs = useBuildLogs()

const { data, pending, error, refresh } = await useFetch<BuildLog[]>(`/api/projects/${routerId}/builds`)
if (data.value)
  logs.value = data.value

watch(data, (newVal) => {
  if (newVal !== null)
    logs.value = newVal
})

async function handleClick(log: BuildLog) {
  buildData.value = log.data
}

async function handleBuildKill() {
  const { data, pending, error, refresh } = await useFetch(`/api/build/${routerId}/kill`, {
    method: 'DELETE',
  })
}

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
    <div class=" flex  justify-between gap-2  w-full">
      <div class=" w-9/12   min-h-[80vh]">
        <div class=" bg-gray-800  rounded-sm h-full ">
          <!-- <Terminal class="w-full h-full overflow-y-auto scrollable-pre text-xs" /> -->
          <pre v-if="buildData" id="pre-build" class="w-full h-full overflow-y-auto whitespace-pre-wrap scrollable-pre text-xs"> {{ buildData }}</pre>
          <pre v-else id="pre-build" class="w-full h-full overflow-auto whitespace-pre-wrap scrollable-pre"> {{ 'no builds logged' }}</pre>
        </div>
      </div>

      <div class="w-3/12">
        <div v-if="logs.length" class=" ">
          <div v-for="log in logs" :key="log.id" class="w-full flex justify-center items-center max-h-[75vh]">
            <BuildLogCard :duration="log.buildTime" :type="log.type" :status="log.status" :date="log.createdAt" :class=" activeId === log.id ? 'bg-white text-black' : ''" @click="handleClick(log)" />
          </div>
        </div>
        <div v-else>
          waiting for builds...
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

  padding: 10px; /* Optional: add padding for better appearance */
}
</style>
