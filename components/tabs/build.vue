<script lang="ts" setup>
import type { WatchStopHandle } from 'vue'

const buildData = useBuildSSE()

interface EventWatch {
  [key: string]: WatchStopHandle | null
}

const Logs = useActiveProject()

const defaults: EventWatch = {}

const activeId = useState('active-log-id')

async function getLogs(id: string) {
//  console.log(id);
  activeId.value = id
  const routerId = useRoute('projects-id').params.id
  const { data, pending, error, refresh } = await useFetch(`/api/build/${routerId}/logs/${id}`)
  // console.log(data.value);

  buildData.value = data.value as string
}

async function handleClick() {
  const id = useRoute('projects-id').params.id
  const watchEvents = useState<EventWatch>('event-source', () => defaults)
  // const data = useState('event-data', () => '')
  buildData.value = ''

  const { data, status, error, close } = useEventSource(`http://localhost:3000/api/build/${id}`)

  if (data.value)
    buildData.value += JSON.parse(data.value).message

  const end = () => Object.values(watchEvents.value).forEach((fn) => {
    if (fn) {
      fn()
      close()
    }
  })

  watchEvents.value.data = watch(data, (value) => {
    console.log(value)

    if (data.value) {
      console.log(JSON.parse(data.value))
      buildData.value += JSON.parse(data.value).message
    }
  })

  watchEvents.value.status = watch(status, () => {
    const sending = status.value === 'CONNECTING' || status.value === 'OPEN'
    if (!sending)
      end()
  })

  watchEvents.value.error = watch(error, () => {
    end()
  })
}
</script>

<template>
  <section class="flex  flex-col items-center  justify-center w-full space-y-3 ">
    <div class="lg:flex space-x-3 w-full">
      <label class="block dark:text-white text-gray-700 text-3xl  font-bold mb-2" for="build-logs">
        Build Logs
      </label>
      <UButton type="button" class=" font-bold py-1" @click="handleClick">
        makeshift build
      </UButton>
      <UTooltip>
        <UIcon name="uil:rocket" class="text-2xl" />
        <template #text>
          <span class="italic">Hello World!</span>
        </template>
      </UTooltip>
    </div>
    <UDivider class="w-full" />
    <div class="w-full flex p-2 gap-2">
      <div class="w-4/5">
        <div class="p-2 bg-zinc-700 rounded-md">
          <pre v-if="buildData.length" id="pre-build" class="w-full h-full overflow-auto whitespace-pre-wrap scrollable-pre"> {{ buildData }}</pre>
          <pre v-else id="pre-build" class="w-full h-full overflow-auto whitespace-pre-wrap scrollable-pre"> {{ 'no builds logged' }}</pre>
        </div>
      </div>
      <div class="w-1/5">
        <div v-for="logs in Logs.buildsLogs" :key="logs.id" class="w-full flex justify-center items-center">
          <BuildLogCard :duration="logs.buildTime" :date="logs.date" :class=" activeId === logs.id ? 'bg-white text-black' : ''" @click="getLogs(logs.id)" />
        </div>
      </div>

      <!-- BUILD STATUS -->
      <!-- BUILD STATUS -->
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
