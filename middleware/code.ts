export default defineNuxtRouteMiddleware(async(to, from) => {
  if (to.query.code) {
    const code = to.query.code
    console.log('code', code);
    // const data = await $fetch()
  }
})
