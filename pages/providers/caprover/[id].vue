<script  lang="ts" setup>
const router = useRoute('providers-caprover-id').params.id

const { data: templates } = await useFetch<string>(`/api/providers/caprover/${router}`)
const thisRef = ref<string>(JSON.stringify(templates as unknown as string)) as unknown as CaproverDockerComposeConfig
console.log(templates.value)
</script>

<template>
  <div class=" pl-32 w-full h-full">
    <pre>
      {{ templates }}
    </pre>
  </div>
</template>
