<script lang="ts" setup>
const router = useRoute()

const items = [
  [{
    label: 'Caprover',
    to: '/providers/caprover',
    icon: 'i-heroicons-pencil-square-20-solid',
    shortcuts: ['e'],
  }, {
    label: 'Portainer',
    to: '/providers/portainer',
    icon: 'i-heroicons-document-duplicate-20-solid',
    shortcuts: ['d'],
  }],
]
// const router = useRouter().getRoutes().map( route => { to: route.path} );

const inactive = 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
</script>

<template>
  <section>
    <div class=" hidden lg:inline-flex relative  overflow-hidden w-full p-4 space-x-5">
      <ULink to="/" active-class="text-primary" :inactive-class="inactive">
        Home
      </ULink>
      <ULink to="/projects" active-class="text-primary" :inactive-class="inactive">
        projects
      </ULink>
      <!-- <UDropdown :items="items" :popper="{ placement: 'bottom-start', arrow: false }">
        <UButton color="white" label="Providers" trailing-icon="i-heroicons-chevron-down-20-solid" />
      </UDropdown> -->
      <ULink to="/providers/portainer" active-class="text-primary" :inactive-class=" inactive ">
        portainer
      </ULink>
      <ULink to="/providers/caprover" active-class="text-primary" :inactive-class=" inactive ">
        caprover
      </ULink>
    </div>
    <UDivider
      :label="router.name === 'index' ? 'home' : router.name"
      :ui="{ label: '' }"
    />
  </section>
</template>

<style></style>
