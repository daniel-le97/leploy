<script lang="ts" setup>
import 'xterm/css/xterm.css'

const terminal = useTerminal()

onMounted(() => {
  terminal.open(document.getElementById('terminal')!)
  terminal.options = {
    cursorBlink: true,
    fontSize: 10,
    fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
    disableStdin: true,
    allowTransparency: true,

  }
  terminal.onResize((size) => {
    console.log(size)
  })
})
</script>

<template>
  <div id="terminal" class="" />
</template>
