export default defineEventHandler(async (event) => {
  const yamls = await useDbStorage('compose').getKeys()
  return yamls
})
