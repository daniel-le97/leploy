export default defineNuxtRouteMiddleware((to, from) => {
  const isLoginOrRegister = computed(() => to.path === '/login' || to.path === '/register')
  const { loggedIn } = useUserSession()
  console.log({ loggedIn: loggedIn.value, isLoginOrRegister: isLoginOrRegister.value })
  if (!loggedIn.value && isLoginOrRegister.value) {
    console.log('returning')
    return
  }

  if (!loggedIn.value && !isLoginOrRegister.value) {
    console.log('middleware/auth.ts:to', to.path)
    return navigateTo('/login')
  }
})
