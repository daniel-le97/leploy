export default defineNuxtRouteMiddleware(async(to, from) => {
  const isLoginOrRegister = computed(() => to.path === '/login' || to.path === '/register')
  const { loggedIn, clear } = useUserSession()
  if (loggedIn.value && isLoginOrRegister.value)
    return await clear()
  if (!loggedIn.value && isLoginOrRegister.value)
    return

  if (!loggedIn.value && !isLoginOrRegister.value)
    return navigateTo('/login')
})
