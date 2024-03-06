<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps(['variant'])
const ripples = ref([])
const containerRef = ref(null)

function addRipple(e) {
  if (!containerRef.value)
    return

  const { left, top } = containerRef.value.getBoundingClientRect()
  const rippleSize = Math.max(containerRef.value.offsetWidth, containerRef.value.offsetHeight)
  const rippleId = Date.now()
  ripples.value.push({
    top: e.clientY - top - rippleSize / 2,
    left: e.clientX - left - rippleSize / 2,
    size: rippleSize,
    id: rippleId,
  })
}

onMounted(() => {
  window.addEventListener('mouseup', purgeRipples)
})

onBeforeUnmount(() => {
  window.removeEventListener('mouseup', purgeRipples)
})

function purgeRipples() {
  ripples.value = []
}
</script>

<template>
  <button
    ref="containerRef" class="relative overflow-hidden"
    :class="[{ outlined: variant === 'outlined', link: variant === 'link' }]" @mousedown="addRipple"
  >
    <transition-group name="ripple" tag="div">
      <div
        v-for="ripple in ripples" :key="ripple.id" class="ripple-circle" :style="{
          top: `${ripple.top}px`,
          left: `${ripple.left}px`,
          width: `${ripple.size}px`,
          height: `${ripple.size}px`,
        }"
      />
    </transition-group>
    <slot />
  </button>
</template>

<style scoped>
button {
  @apply font-bold px-4 py-2 hover:scale-[1.01] active:scale-100 transition-all duration-150 ease-in-out;
}

.outlined {
  background-color: transparent;
  border: 1px solid
}

.link {
  background-color: transparent;
  border: none;
  outline: none;
  text-decoration: underline;

}

.custom-button {

  position: relative;
  overflow: hidden;
  display: inline-block;

  padding: 10px 20px;

}

.ripple-circle {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  animation: ripple-animation 0.6s linear;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>
