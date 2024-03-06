export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'id')
  const vol = getRouterParam(event, 'volume')
  const user = requireAuthSession(event)
  if (!projectId || !vol)
    return

  console.log('delete volume', vol)

  projectVolumesService.deleteVolume(vol)
})
