<script setup>
import SideNavBar from './components/navigation/sideNavBar.vue'

</script>

<template>
  <div class="flex w-full  min-h-screen">
    <div class="">
      <SideNavBar />
    </div>
    <NuxtPage />
    <UNotifications />
  </div>
</template>
