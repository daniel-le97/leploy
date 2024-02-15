<script lang="ts" setup>
// const ws = useWs()

async function handleClick() {
  const state = useState('selectedTab')
  state.value = 'build'
  useBuildSSE().value = ''

  const id = useRoute('projects-id').params.id
  // ws.send(JSON.stringify({ type: 'subscribe', payload: { id } }))
  const data = await $fetch(`/api/build/${id}`, {
    method: 'POST',
  })
}

const project = useLiteProject()

function goToProject() {
  window.open(project.value.deployed || 'https://www.youtube.com', '_blank')
}
</script>

<template>
  <div>
    <div class="flex items-center space-x-2 ">
      <h1 class="text-2xl font-bold">
        Configurations
      </h1>
      <UBadge>Healthy</UBadge>
    </div>
    <RippleBtn class="rounded-md bg-blue-700 flex gap-2 justify-center text-center align-middle" @click="handleClick">
      <Icon name="material-symbols:deployed-code-update-outline-rounded" class="text-xl text-center align-middle text" />
      <span class="">Deploy</span>
    </RippleBtn>
    <!-- <RippleBtn class="rounded-md bg-orange-400 flex gap-2 justify-center text-center align-middle">
      <Icon name="i-heroicons-arrow-path-solid" class="text-xl text-center align-middle text" />
      <span class="">force redeploy</span>
    </RippleBtn> -->
    <RippleBtn v-if="project.deployed.length" class="rounded-md bg-red-500 flex gap-2 justify-center text-center align-middle">
      <Icon name="heroicons:stop-circle" class="text-xl text-center align-middle text" />
      <span class="">stop</span>
    </RippleBtn>

    <RippleBtn v-if="project.deployed.length" class="rounded-md bg-green-500 flex gap-2 justify-center text-center align-middle" @click="goToProject">
      <Icon name="i-heroicons-arrow-up-right" class="text-xl text-center align-middle text" />
      <span class="">open</span>
    </RippleBtn>
  </div>
</template>

<style>

</style>
