import type { ProjectEnv } from '../../../../../../types/env'

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'id')
  if (!projectId)
    return

  const body = await readBody<{ name: string, value: string, forBuild: boolean | number }>(event)
  console.log(body)

  const env: ProjectEnv = {
    id: crypto.randomUUID(),
    projectId,
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
    name: body.name,
    value: body.value,
    forBuild: body.forBuild === 1 || body.forBuild === true,
  }
  projectEnvService.createEnv(env)
})
