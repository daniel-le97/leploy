<script lang="ts" setup>
const value = ref('const world = "hello-world"')

async function save(data: any) {
  await useFetch(`/api/compose/${data.name}`, {
    method: 'PUT',
    body: JSON.stringify(data.data),
  })
}

const { data } = await useFetch('/api/compose')
</script>

<template>
  <ClientOnly>
    <LazyMyMonacoEditor :value="value" language="typescript" class="monaco" />
  </ClientOnly>
</template>

<style>
.monaco{
  min-height: 50vh;
}
</style>
