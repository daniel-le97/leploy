export default defineNuxtRouteMiddleware((to, from) => {
  const isLoginOrRegister = computed(() => to.path === '/login' || to.path === '/register')
  const { loggedIn } = useUserSession()
  if (!loggedIn.value && isLoginOrRegister.value)
    return

  if (!loggedIn.value && !isLoginOrRegister.value)
    return navigateTo('/login')
})
