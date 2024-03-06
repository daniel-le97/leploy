export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === '/') {
    console.log('redirecting to /projects')

    return await navigateTo('/projects')
  }
})
