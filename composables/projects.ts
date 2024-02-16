class ClientProjectsService {
  async getProjects() {
    return await $fetch('/api/projects')
  }

  async buildProject(id: string) {
    return await $fetch(`/api/build/${id}`, {
      method: 'POST',
    })
  }
  // async getProjectById(id: string) {
  //   return await $fetch(`/api/projects/${id}`)
  // }

  async deleteProject(id: string) {
    await $fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    })
  }
}

export const projectsService = new ClientProjectsService()
