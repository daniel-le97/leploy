export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'id')
  const envId = getRouterParam(event, 'envId')
  const user = requireAuthSession(event)
  if (!projectId || !envId)
    return

  console.log('delete env', envId)

  projectEnvService.deleteEnv(envId)
})
