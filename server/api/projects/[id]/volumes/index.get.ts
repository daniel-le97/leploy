import { projectVolumesService } from '../../../../db/services/volumes'

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'id')
  if (!projectId)
    return

  return projectVolumesService.getProjectVolumes(projectId)
})
