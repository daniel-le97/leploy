<!-- components/Tabs.vue -->
<script setup lang="ts">
import { LazyTabsBuild, LazyTabsConfiguration, LazyTabsSecrets } from '#components'

const route = useRoute('projects-id')
// console.log(route.params)

const selectedTab = useState('selectedTab', () => 'configuration')

const tabs = computed(() => {
  // if (useActiveProject().value.configured) {
  //   return [
  //     { label: 'configuration', component: LazyTabsConfiguration },
  //     { label: 'compose', component: LazyTabsCompose },
  //     { label: 'build', component: LazyTabsBuild },
  //     { label: 'secrets', component: LazyTabsSecrets },
  //   ]
  // }
  return [
    { label: 'configuration', component: LazyTabsConfiguration },
    { label: 'build', component: LazyTabsBuild },
    { label: 'secrets', component: LazyTabsSecrets },
  ]
})

function selectTab(index: string) {
  selectedTab.value = index
}

onUnmounted(() => {
  const ws = useWs()
  ws.send(JSON.stringify({ type: 'unsubscribe', payload: { id: route.params.id } }))
  console.log('unsubscribed from', route.params.id)
})

// onMounted( () => setPageLayout('application-layout'))
</script>

<template>
  <div class="p-2 w-full">
    <div class="flex items-center justify-between mb-20">
      <!-- <div class="flex items-center space-x-2 ">
        <h1 class="text-2xl font-bold">
          Configurations
        </h1>
        <UBadge>Healthy</UBadge>
      </div> -->
      <TabsApplicationControlBar class="flex gap-2" />
    </div>
    <!-- <TabsApplicationControlBar class="flex gap-2" /> -->
    <div class="flex   gap-3">
      <!-- Left sidebar with buttons -->
      <div class="p-2  border border-gray-300/30 h-fit rounded-sm">
        <RippleBtn
          v-for="(tab, index) in tabs"
          :key="index"
          :class="{ 'bg-white text-black': selectedTab === tab.label }"
          class="w-full p-2 mb-2 text-left max rounded"
          @click="selectTab(tab.label)"
        >
          {{ tab.label }}
        </RippleBtn>
      </div>

      <!-- Main component area -->
      <div class=" w-full">
        <div v-for="(tab, index) in tabs" :key="index">
          <div v-if="selectedTab === tab.label">
            <component :is="tab.component" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
