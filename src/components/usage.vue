<script setup>
import { onMounted, ref } from 'vue'

const cpuUsage = ref({})
const memoryUsage = ref({})

onMounted(() => {
  // Function to update CPU usage and Memory usage
  const updateUsage = () => {
    cpuUsage.value = process.cpuUsage()
    memoryUsage.value = process.memoryUsage()
  }

  // Update CPU and Memory usage initially
  updateUsage()

  // Update CPU and Memory usage every second
  setInterval(updateUsage, 1000)
})
</script>

<template>
  <div>
    <h2>CPU and Memory Usage</h2>
    <div>
      <p><strong>CPU Usage:</strong> {{ cpuUsage }}</p>
      <p><strong>Memory Usage:</strong> {{ memoryUsage }}</p>
    </div>
  </div>
</template>
