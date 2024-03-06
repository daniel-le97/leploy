<script setup lang="ts">
const email = useState('email', () => 'test@gmail.com')
const password = useState('password', () => 'password')
const route = useRoute()
const isLogin = route.name === 'login'
const header = computed(() => isLogin ? 'Welcome!' : 'Create an Account!')
const buttonMessage = computed(() => isLogin ? 'Sign in' : 'Register')
const name = route.name === 'login' ? 'login' : 'register'

async function handleSubmit(type: 'login' | 'register') {
  await useCredentials(type, { email: email.value, password: password.value })
  await navigateTo('/')
}
async function handleNavigate(type: 'login' | 'register') {
  await navigateTo(type)
}

async function handleGithub() {
  console.log('github')

  const { loggedIn, user, fetch } = useUserSession()
  // await fetch()
  // console.log('data', loggedIn.value, user.value);

  await navigateTo('/api/auth/github')
}

const { session, user } = useUserSession()
const providers = computed(() => [
  {
    label: session.value.user?.github?.login || 'GitHub',
    to: '/auth/github',
    disabled: Boolean(user.value?.github),
    icon: 'i-simple-icons-github',
  },

  {
    label: session.value.user?.google?.email || 'Google',
    to: '/auth/google',
    disabled: Boolean(user.value?.google),
    icon: 'i-simple-icons-google',
  },

].map(p => ({
  ...p,
  prefetch: false,
  external: true,
})))
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-black w-screen">
    <div class="bg-white p-8 rounded-md w-full sm:w-96 shadow-xl">
      <h2 class="text-2xl text-black font-semibold mb-6">
        {{ header }}
      </h2>

      <form @submit.prevent="handleSubmit(name)">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 text-sm font-medium mb-2">Email</label>
          <input
            id="email"
            v-model="email"
            autocomplete="email"
            type="email"
            name="email"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          >
        </div>

        <div class="mb-6">
          <label for="password" class="block text-gray-700 text-sm font-medium mb-2">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            name="password"
            autocomplete="current-password"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          >
        </div>

        <div class="flex items-center justify-between">
          <button type="submit" class="bg-blue-500 text-white px-6 py-2 rounded-md focus:outline-none">
            {{ buttonMessage }}
          </button>
          <div class="flex gap-2">
            <a href="/auth/github" class="text-sm text-gray-600 hover:underline border border-indigo-950 p-2 rounded">
              <Icon name="skill-icons:github-light" class="w-5 h-5 inline-block mr-1" />
            </a>
          </div>
        </div>
      </form>

      <div class="mt-6">
        <p v-if="isLogin" class="text-sm text-gray-600">
          Don't have an account?
          <button class="text-blue-500 hover:underline" @click="handleNavigate('register')">
            Register
          </button>
        </p>
        <p v-else class="text-sm text-gray-600">
          Already have an account?
          <button class="text-blue-500 hover:underline" @click="handleNavigate('login')">
            Sign In
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
