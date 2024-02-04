<script setup lang="ts">
import type { ProjectEnv } from '../../types/env'

interface ENV {
  name: string | null
  value: string | null
  forBuild: boolean
}

const envRef = ref<ENV>({
  name: null,
  value: null,
  forBuild: false,
})

const id = useRoute('projects-id').params.id

const { data, pending, error, refresh } = await useFetch<ProjectEnv[]>(`/api/projects/${id}/env`)
console.log({ data: data.value })

async function handleEnvCreate(env: ENV, _refresh = false) {
  if (!env.name || !env.value)
    return

  env.forBuild = env.forBuild || false

  const projectId = await $fetch<string>(`/api/projects/${id}/env`, {
    method: 'POST',
    body: env,
  })

  if (_refresh) {
    await refresh()
    envRef.value = {
      name: null,
      value: null,
      forBuild: false,
    }
  }
}
const bottomTextArea = ref('')

async function handleEnvSubmit() {
  if (!bottomTextArea.value)
    return

  const parseEnvs = bottomTextArea.value.split('\n')
  for await (const env of parseEnvs) {
    const [name, value] = env.split('=')
    if (!name || !value)
      continue

    console.log(name, value)

    await handleEnvCreate({
      name,
      value,
      forBuild: false,
    })
  }
  bottomTextArea.value = ''
  await refresh()
}

async function deleteEnv(projectEnv: ProjectEnv) {
  // Logic to enable editing for the selected projectEnv
  console.log(`Deleting projectEnv: ${projectEnv.id}`)
  await $fetch(`/api/projects/${id}/env/${projectEnv.id}`, {
    method: 'DELETE',
  })
  await refresh()
}


async function handleForBuildChange(projectEnv: ProjectEnv) {
  // Logic to enable editing for the selected projectEnv
  console.log(`Updating projectEnv: ${projectEnv}`)

}
function updateProjectEnv(projectEnv: ProjectEnv) {
  // Logic to update the selected projectEnv
  console.log(`Updating projectEnv: ${projectEnv.id}`)
}
</script>

<template>
  <div class="flex flex-col border border-gray-300/30 rounded-sm ">
    <!-- Top Section -->
    <div class="p-4  border-b border-gray-300/30 ">
      <div v-for="env in data" :key="env.id" class="mb-4 flex flex-row justify-between items-center">
        <RippleBtn class="ml-4 bg-blue-500 text-white px-2 py-1 rounded" @click="updateProjectEnv(env)">
          Update
        </RippleBtn>
        <Icon name="uil:trash-alt" class="text-2xl text-red-500 cursor-pointer" @click="deleteEnv(env)" />
        <div>
          <strong>Key: </strong>
          <input v-model="env.name" class="w-48 border rounded text-xs">
        </div>
        <div>
          <strong>Value: </strong>
          <input v-model="env.value" class="w-48 border rounded text-xs" >
        </div>
        <!-- <div> {{ env.id }}</div> -->
        <div>
          <strong>Build Time: </strong>
            <input v-model="env.forBuild" type="checkbox">
        </div>
      </div>
      <form class="flex flex-row justify-between items-center py-2">
        <RippleBtn class="ml-4 bg-blue-500 text-white px-2 py-1 rounded" type="submit" @click.prevent="handleEnvCreate(envRef, true)">
          create
        </RippleBtn>
        <div>
          <strong>Key: </strong>
          <input v-model="envRef.name" class="w-48 border rounded">
        </div>
        <div>
          <strong>Value: </strong>
          <input v-model="envRef.value" class="w-48 border rounded">
        </div>
        <div>
          <strong>Build Time: </strong>
          <input v-model="envRef.forBuild" type="checkbox">
        </div>
      </form>
    </div>

    <RippleBtn class="pt-3" @click="handleEnvSubmit">
      SUBMIT ENV
    </RippleBtn>
    <!-- Bottom Section (Scrollable Div) -->
    <div class="flex-grow overflow-y-auto p-4">
      <!-- Text area for the bottom section -->
      <textarea v-model="bottomTextArea" class="w-full h-full p-2 border" placeholder="Enter text..." />
    </div>
  </div>
</template>
