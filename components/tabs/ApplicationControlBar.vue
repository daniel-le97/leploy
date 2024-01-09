<script lang="ts" setup>
import type { WatchStopHandle } from 'vue'

interface EventWatch {
  [key: string]: WatchStopHandle | null
}
const defaults: EventWatch = {}

async function handleClick() {
  console.log('building project')

  const id = useRoute('projects-id').params.id

  const { data, pending, error, refresh } = await useFetch(`/api/build/${id}`)

}
</script>

<template>
  <div>
    <RippleBtn class="rounded-md bg-blue-700 flex gap-2 justify-center text-center align-middle" @click="handleClick">
      <Icon name="material-symbols:deployed-code-update-outline-rounded" class="text-xl text-center align-middle text" />
      <span class="">Deploy</span>
    </RippleBtn>
    <RippleBtn class="rounded-md bg-orange-400 flex gap-2 justify-center text-center align-middle">
      <Icon name="i-heroicons-arrow-path-solid" class="text-xl text-center align-middle text" />
      <span class="">force redeploy</span>
    </RippleBtn>
    <RippleBtn class="rounded-md bg-red-500 flex gap-2 justify-center text-center align-middle">
      <Icon name="heroicons:stop-circle" class="text-xl text-center align-middle text" />
      <span class="">stop</span>
    </RippleBtn>
    <RippleBtn class="rounded-md bg-green-500 flex gap-2 justify-center text-center align-middle">
      <Icon name="i-heroicons-arrow-up-right" class="text-xl text-center align-middle text" />
      <span class="">open</span>
    </RippleBtn>
  </div>
</template>

<style>

</style>
