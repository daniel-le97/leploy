<script setup lang="ts">
import type { ProjectVolume } from '../../types/env'

interface VOL {
  name: string | null
  value: string | null

}

const volRef = ref<VOL>({
  name: null,
  value: null,
})

const id = useRoute('projects-id').params.id

const { data, pending, error, refresh } = await useFetch<ProjectVolume[]>(`/api/projects/${id}/volumes`)
console.log({ data: data.value })

async function handleVolCreate(vol: VOL, _refresh = false) {
  if (!vol.name || !vol.value)
    return

    console.log(vol);
    
  const projectId = await $fetch<string>(`/api/projects/${id}/volumes`, {
    method: 'POST',
    body: vol,
  })

  if (_refresh) {
    await refresh()
    volRef.value = {
      name: null,
      value: null,
    }
  }
}

async function deletevol(projectVolume: ProjectVolume) {
  // Logic to enable editing for the selected ProjectVolume
  console.log(`Deleting ProjectVolume: ${projectVolume.id}`)
  await $fetch(`/api/projects/${id}/volumes/${projectVolume.id}`, {
    method: 'DELETE',
  })
  await refresh()
}

async function handleForBuildChange(projectVolume: ProjectVolume) {
  // Logic to enable editing for the selected ProjectVolume
  console.log(`Updating ProjectVolume: ${projectVolume}`)
}
function updateProjectVolume(projectVolume: ProjectVolume) {
  // Logic to update the selected ProjectVolume
  console.log(`Updating ProjectVolume: ${projectVolume.id}`)
}
</script>

<template>
  <div class="flex flex-col border border-gray-300/30 rounded-sm ">
    <!-- Top Section -->

    <div class="p-4  border-b border-gray-300/30 ">
      <div v-for="vol in data" :key="vol.id" class="mb-4 flex flex-row justify-between items-center">
        <RippleBtn class="ml-4 bg-blue-500 text-white px-2 py-1 rounded">
          Update
        </RippleBtn>
        <Icon name="uil:trash-alt" class="text-2xl text-red-500 cursor-pointer" @click="deletevol(vol)" />
        <div>
          <strong>Key: </strong>
          <input v-model="vol.name" class="w-48 border rounded text-xs">
        </div>
        <div>
          <strong>Value: </strong>
          <input v-model="vol.value" class="w-48 border rounded text-xs">
        </div>
        <!-- <div> {{ vol.id }}</div> -->
        <!-- <div>
          <strong>Build Time: </strong>
          <input v-model="vol.forBuild" type="checkbox">
        </div> -->
      </div>
      <div class="border border-white"></div>
      <form class="flex flex-row justify-center gap-8 items-center py-2">
        <RippleBtn class="ml-4 bg-blue-500 text-white px-2 py-1 rounded" type="submit" @click.prevent="handleVolCreate(volRef, true)">
          create
        </RippleBtn>
        <div class="flex flex-row gap-4">
          <div>
            <!-- <strong>Key: </strong> -->
            <input v-model="volRef.name" class="w-60 border rounded" placeholder="mount point on the system host">
          </div>
          <div>
            <!-- <strong></strong> -->
            <!-- <label for="value">Value: </label> -->
            <input v-model="volRef.value" class="w-60 border rounded" placeholder="mount point in the container">
          </div>
        </div>
        <!-- <div>
          <strong>Build Time: </strong>
          <input v-model="volRef.forBuild" type="checkbox">
        </div> -->
      </form>
    </div>

   <!-- <RippleBtn class="pt-3" @click="handleVolCreate(volRef, true)">
      SUBMIT vol
    </RippleBtn>  -->


  </div>
</template>
