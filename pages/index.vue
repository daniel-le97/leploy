<script setup lang="ts">
const input = ref('')

async function create() {
  const location = window?.location.origin
  // input.value.homepage_url = location
  // input.value.redirect_url = location
  const stringified = JSON.stringify(input.value)
  console.log('clicked', { stringified })
  const { data, pending, error, refresh } = await useFetch('https://github.com/settings/apps/new', {
    method: 'POST',
    mode: 'navigate',
    params: {
      manifest: JSON.stringify(input.value),
      state: 'create',
    },
    redirect: 'follow',

  })
  console.log(data, pending, error, refresh)
  // await navigateTo('https://nuxt.com', {
  //   external: true,
  // })
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
</script>

<template>
  <div>
    <ClientOnly>
      <form action="https://github.com/settings/apps/new?state=abc123" method="post">
        Register a GitHub App Manifest: <input id="manifest" type="text" :value="input" name="manifest"><br>
        <input type="submit" value="Submit">
      </form>
    </ClientOnly>
  </div>
</template>
