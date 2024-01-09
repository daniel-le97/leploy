export default defineEventHandler(async (event) => {
  // TODO change when auth is implemented
  // const user = 'me'
  const session = await requireAuthSession(event)
  // console.log(session.id);

  const db = useDbStorage('projects')
  const keys = await db.getKeys(session.user?.id)
  const projects: Project[] = []
  for await (const key of keys) {
    const project = await db.getItem<Project>(key)
    if (project)
      projects.push(project)
  }
  return projects.length >= 1 ? projects : null
  // projects.push(await db.getItem(key) as unknown as Project)

  // console.log(projects);
})
