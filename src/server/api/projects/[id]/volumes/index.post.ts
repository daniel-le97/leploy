import type { ProjectVolume } from '../../../../../../types/env'

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'id')
  if (!projectId)
    return

  const body = await readBody<{ name: string, value: string, forBuild: boolean | number }>(event)
  console.log(body)

  const vol: ProjectVolume = {
    id: crypto.randomUUID(),
    projectId,
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
    name: body.name,
    value: body.value,
  }
  projectVolumesService.createVolume(vol)
})
