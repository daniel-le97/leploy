// import type { Project } from "../types/project";

import type { Project, SqliteProject } from '../types/project'

export const useTabIndex = () => useState('tab-index', () => 0)

export const useActiveId = () => useState('activeRepoId', () => '')

// we use this for our active build, since at the moment
// there is only ever one build happening at a time (task queueing)
export const useBuildSSE = () => useState('sse', () => '')

export const useRepo = () => useState('repo', () => 'https://github.com/daniel-le97/nuxt-elysia')

export const useActiveTemplate = () => useState('activeTemplate', () => '')

export const useActiveProject = () => useState<Project>('activeProject')

export const useLiteProject = () => useState<SqliteProject>('liteProject')

export async function refreshActiveProject() {
  const route = useRoute('projects-id')
  const { data, pending, error, refresh } = await useFetch<Project>(`/api/projects/${route.params.id}`)
  if (data.value) {
    const activeProject = useActiveProject()
    activeProject.value = data.value
  }
}