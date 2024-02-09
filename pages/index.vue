<script setup lang="ts">
import GithubRegister from '../components/GithubRegister.vue'

const auth = useUserSession()
</script>

<template>
  <div>
    <div>
      <div class="p-5 flex flex-col gap-4">
        <div class="flex items-center justify-center text-5xl font-extrabold  ">
          That Home Page Though.
        </div>
        <div class="">
          {{ auth.loggedIn }}
        </div>
        <div class="">
          {{ auth.user }}
        </div>
      </div>
      <button class="bg-green text-green-600" type="button" @click="authLogout">
        logout
      </button>
    </div>
    <ClientOnly>
      <GithubRegister />
    </ClientOnly>
  </div>
</template>
