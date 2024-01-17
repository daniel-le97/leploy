<script setup>
import SideNavBar from './components/navigation/sideNavBar.vue'

const route = useRoute()
const isLoginOrRegister = computed(() => route.fullPath.includes('/login') || route.fullPath.includes('/register'))
</script>

<template>
  <div class="flex w-full  min-h-screen">
    <div v-if="!isLoginOrRegister" class="">
      <SideNavBar />
    </div>
    <NuxtPage />
    <UNotifications />
  </div>
</template>
