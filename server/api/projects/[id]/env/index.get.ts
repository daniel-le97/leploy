export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'id')
  if (!projectId)
    return

  let envs = projectEnvService.getProjectEnvs(projectId)
  envs = envs.map((env) => {
    const num = Number(env.forBuild)
    env.forBuild = num === 1
    return env
  })
  return envs
})
