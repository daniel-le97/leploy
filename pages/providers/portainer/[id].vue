<script  lang="ts" setup>
const router = useRoute().params.id
console.log(router)

const { data: templates } = await useFetch(`/api/providers/portainer/templates/${router}`)
const thisRef = ref<string>(JSON.stringify(templates as unknown as string)) as unknown as CaproverDockerComposeConfig
// console.log(templates.value)
</script>

<template>
  <div>
    <pre>
      {{ templates }}
    </pre>
  </div>
</template>
