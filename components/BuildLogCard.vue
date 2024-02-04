<script setup>
const props = defineProps(['branch', 'date', 'id', 'duration', 'type', 'status'])
const durationInSeconds = computed(() => props.duration / 1e9)
const minutes = computed(() => Math.floor(durationInSeconds.value / 60))
// const seconds = computed(() => durationInSeconds.value % 60)
const displayDuration = computed(() => {
  if (minutes.value > 0)
    return `${minutes.value}m ${durationInSeconds.value.toFixed(2)}s`

  else
    return `${durationInSeconds.value.toFixed(2)}s`
})
const timeago = useTimeAgo(props.date)
</script>

<template>
  <div class="flex  w-full  ">
    <div class=" rounded-md flex gap-2   hover:bg-zinc-700 p-2 transition-all duration-150">
      <div class="w-1/3">
        <div class="flex flex-col items-center justify-center text-center space-y-0.5">
          <strong>Main</strong>
          <div class="text-xs">
            {{ props.type ?? 'manual' }}
          </div>
          <span v-if="props.status === 'success'" class=" text-xs bg-zinc-800 rounded-lg  flex items-center justify-center text-green-300 ">{{ props.status }}</span>
          <span  v-else class=" text-xs bg-zinc-800 rounded-lg  flex items-center justify-center text-red-300 ">{{ props.status }}</span>
        </div>
      </div>
      <div class="w-2/3  text-xs flex flex-col items-center justify-center text-center">
        <div class="text-xs">
          {{ timeago }}
        </div>
        <div class="flex gap-1 ">
          <span>finished in </span> <strong> {{ displayDuration }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>
