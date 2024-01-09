<script lang="ts" setup>
const projectid = useRoute('projects-id').params.id
const { data, pending, error, refresh } = await useFetch < string > (`/api/projects/${projectid}/compose`)
// const compose = JSON.stringify(data.value)
</script>

<template>
  <div>
    <MonacoEditor v-if="data" v-model="data" lang="yaml" class="min-h-screen" />
    <div v-else>
      no compose found
    </div>
    <!-- <textarea v-if="data" v-model="data" class="w-screen min-h-screen" /> -->
  </div>
</template>

<style>

</style>
