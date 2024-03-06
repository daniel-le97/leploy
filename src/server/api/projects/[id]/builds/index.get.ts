export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const user = await requireAuthSession(event)
  if (!id) {
    throw NOTFOUND
  }
  let logs = logsService.getLogsByProjectId(id)
  if (!logs || !logs.length) {
   logs = []
  }
  return logs
})
