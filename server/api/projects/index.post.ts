import * as fs from 'node:fs'

export default defineEventHandler(async (event) => {
  try {
    const ip = getRequestIP(event)
    const body = await readBody(event)
    const session = await requireAuthSession(event)

    // const project: Project = {
    //   id: crypto.randomUUID(),
    //   user: session.id,
    //   createdAt: new Date().toLocaleString(),
    //   name: generateName(),
    //   deployed: '',
    //   configured: false,
    //   buildsLogs: [],
    //   ports: [],
    //   https: true,
    //   www: true,
    //   managed: true,
    //   application: {
    //     repoUrl: '',
    //     startCommand: '',
    //     buildCommand: '',
    //     installCommand: '',
    //     buildPack: 'nixpacks',
    //   },
    // }

    const project = await projectsService.createProject(session.id)

    return project
    // if (!fs.existsSync(path))
    //   fs.mkdirSync(path, { recursive: true })

    // const db = await useDbStorage('projects').setItem(`${project.user}:${project.id}`, project)
    // return project
  }
  catch (error) {
    console.log(error)
  }
})
