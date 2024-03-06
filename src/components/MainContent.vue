<script setup>
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <div :class="{ 'ml-1/5': !collapsed, 'ml-1/12': collapsed }" class="transition-margin-left duration-300">
    <!-- Main content area -->
    <slot />
  </div>
</template>

<style scoped>
/* Add other styling as needed */
</style>
