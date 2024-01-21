<script setup lang="ts">
import GithubRegister from '../components/GithubRegister.vue';

definePageMeta({
  middleware: ['code'],
})

const input = ref('')

const route = useRoute()
watch(route, (query) => {
  console.log({ query })
})

async function create() {
  // const location = window?.location.origin
  // input.value.homepage_url = location
  // input.value.redirect_url = location
  const stringified = JSON.stringify(input.value)
  console.log('clicked', { stringified })
  const data = await $fetch('/api/github/apps', {
    method: 'GET',
    body:{manifest: stringified}
  })
  console.log({ data})
 
}

// const location = computed(() => window?.location?.origin)

onMounted(() => {
  console.log('mounted')

  const location = window?.location.origin || 'http://localhost:3000'
  const value = {
    name: 'le-ploy-source-1',
    description: 'test',
    hook_attributes: {
      url: 'https://smee.io/2CheYVHetZe4ROm',
    },
    public: true,
    url: location, // Assuming loc is defined
    redirect_url: location, // Assuming loc is defined
    default_events: ['deployment', 'pull_request', 'push'],
    default_permissions: {
      contents: 'read',
      deployments: 'write',
      metadata: 'read',
      pull_requests: 'read',
    },
  }

  const stringified = JSON.stringify(value)
  input.value = stringified
  // console.log('clicked', { stringified })
})
const code = 'http://localhost:3000/?code=727aa4b859b15cc7ccba90de2168544ccdf8c8cb&state=abc123'
const auth = useUserSession()
</script>

<template>
  <div>
    <div>
      auth
      {{ auth }}
      <button class="bg-green" type="button" @click="authLogout">
        logout
      </button>
    </div>
    <ClientOnly>
      <GithubRegister />
    </ClientOnly>
  </div>
</template>
