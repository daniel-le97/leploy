import type { SqliteProject } from "../types/project";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const hasPath = to.path.includes('projects')
  // @ts-expect-error id will be there
  const id = to.params.id
  if (!hasPath || !id)
    return

  const project = await $fetch<SqliteProject>(`/api/projects/${id}`)
  useLiteProject().value = project
  console.log('middleware:project', project)
})
