export default defineNuxtPlugin((nuxtApp) => {
  const { user, loggedIn } = useUserSession()
  watch(loggedIn, async (val) => {
    if (!val)
      await navigateTo('/login')
  })
})
