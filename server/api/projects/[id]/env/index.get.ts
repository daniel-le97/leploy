export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'id')
  if (!projectId)
    return

  const envs = projectEnvService.getProjectEnvs(projectId)
  return envs
})
