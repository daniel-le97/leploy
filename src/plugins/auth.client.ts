export default defineNuxtPlugin(async (nuxtApp) => {
  const { user, loggedIn } = useUserSession()
  watch(loggedIn, async (val) => {
    if (!val)
      await navigateTo('/login')
  })
})
