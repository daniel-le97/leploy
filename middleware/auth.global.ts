export default defineNuxtRouteMiddleware((to, from) => {
  const isLoginOrRegister = computed(() => to.path === '/login' || to.path === '/register')
  const { loggedIn } = useUserSession()
  if (!loggedIn.value && isLoginOrRegister.value) {
    console.log('no navigation needed')
    return
  }

  if (!loggedIn.value && !isLoginOrRegister.value) {
    console.log('navigating to:', '/login')
    return navigateTo('/login')
  }
})
