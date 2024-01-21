<script setup>
const registrationUrl = 'https://github.com/settings/apps/new?state=abc123'
const id = crypto.randomUUID().slice(0, 8)

const manifest = JSON.stringify({
  name: `le-ploy-source-${id}`,
  url: 'http://localhost:3000',
  hook_attributes: {
    url: 'https://smee.io/2CheYVHetZe4ROm',
  },
  redirect_url: 'http://localhost:3000/api/git/new',
  public: true,
  default_events: ['deployment', 'pull_request', 'push'],
  default_permissions: {
    contents: 'read',
    deployments: 'write',
    metadata: 'read',
    pull_requests: 'read',
  },
})
</script>

<template>
  <form :action="registrationUrl" method="post">
    Register a GitHub App Manifest:
    <input v-model="manifest" name="manifest" class="w-full p-2 border" required>
    <input type="submit" value="Submit" class="mt-2 px-4 py-2 bg-blue-500 text-white cursor-pointer">
  </form>
</template>
