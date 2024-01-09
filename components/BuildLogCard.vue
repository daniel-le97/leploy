<script setup>
const props = defineProps(['branch', 'date', 'id', 'duration'])
const durationInSeconds = computed(() => props.duration / 1000)
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
  <div class="flex flex-col pt-2 space-y-4 ">
    <div class=" rounded-md flex   hover:bg-zinc-700 p-2 transition-all duration-150">
      <div class="w-1/3">
        <div class="flex flex-col items-center justify-center text-center space-y-0.5">
          <strong>Main</strong>
          <div class="text-sm">
            manual
          </div>
          <span class=" pb-0.5 px-2 bg-zinc-800 rounded-lg  flex items-center justify-center text-green-300 font-semibold">success</span>
        </div>
      </div>
      <div class="w-2/3  text-sm flex flex-col items-center justify-center text-center">
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
