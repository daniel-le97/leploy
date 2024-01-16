import type { HTTPHeaderName } from 'h3'

// function to strip headers of all but the ones that contain a substring
function filterHeadersBySubstring<T>(headers: Partial<Record<HTTPHeaderName, string | undefined>>, string: string) {
  const filteredHeaders: Record<string, string | undefined> = {}

  for (const key in headers) {
    if (key.includes(string))
      filteredHeaders[key] = headers[key]
  }

  return filteredHeaders as T
}

// async function findProject(url: string) {
//   const db = useDbStorage('projects')
//   const keys = await db.getKeys()
//   const apps: Project[] = []
//   for await (const key of keys) {
//     const item = await db.getItem<Project>(key)
//     if (item) {
//       if (item.application.repoUrl.includes(url)) {
//         const logsPath = `${process.cwd()}/data/logs/${item.id}/`
//         const processProject = {
//           ...item,
//           key,
//           logsPath,
//         }
//         await queue.addProject(processProject)
//       }
//     }
//   }
//   // console.log(apps)

//   return apps
// }

// this route handler is for processing github webhooks
export default defineEventHandler(async (event) => {
  // this will be the id of the github app
  const id = getRouterParam(event, 'id')

  const body = await readBody<GitHubWebhookPayload>(event)
  const url = 'https://github.com/daniel-le97/astro-portfolio'
  const headers = filterHeadersBySubstring<GitHubWebhookHeaders>(getHeaders(event), 'hub')

  const projects = await projectsService.getProjectByRepoUrl(url)
  for await (const project of projects)
    await serverHooks.callHook('build', { ...project, type: 'webhook' })

  return 'ok'
})
