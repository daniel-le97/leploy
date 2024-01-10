import { Probot, createNodeMiddleware, createProbot } from 'probot'

async function findProject(url: string) {
  const db = useDbStorage('projects')
  const keys = await db.getKeys()
  const apps: Project[] = []
  for await (const key of keys) {
    const item = await db.getItem<Project>(key)
    if (item) {
      if (item.application.repoUrl.includes(url)) {
        const logsPath = `${process.cwd()}/data/logs/${item.id}/`
        const processProject = {
          ...item,
          key,
          logsPath,
        }
        await queue.addProject(processProject)
      }
    }
  }
  // console.log(apps)

  return apps
}

// For more information, see https://probot.github.io/docs/development/
function probot(app: Probot) {
  app.log.info('Yay, the app was loaded!')
  app.on('push', async (context: { payload: { repository: { html_url: any } } }) => {
    // consola.info('onAny')
    // console.log(context)

    app.log.info(context.payload)
    app.log.info(context.payload.repository.html_url)
    const url = context.payload.repository.html_url
    await findProject(url)
    // await context.octokit.repos.downloadTarballArchive
  })
}

export default defineEventHandler(async (event) => {
  // console.log(event);
  const id = getRouterParam(event, 'id')
  console.log(id)

  // TODO need to fetch the credentials from the database
  const probotApp = new Probot({
    appId: process.env.APP_ID,
    privateKey: process.env.PRIVATE_KEY,
    secret: process.env.WEBHOOK_SECRET,
    // webhookPath: "/api/webhooks",
  })

  const middleware = fromNodeMiddleware(createNodeMiddleware(probot, { webhooksPath: `/api/git/webhooks/${id}`, probot: probotApp }))
  return middleware(event)
})
