import { convertPortainerTemplatesToDockerCompose } from '~/server/extra/DockerComposeService'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id)
    return

  const db = useDbStorage('templates:portainer')
  const templatesFile = await db.getItem('template.json') as ITemplateFile
  const foundTemplate = templatesFile.templates.find(template => template.name === id)
  let stackfile = foundTemplate?.repository?.stackfile
  stackfile = stackfile ? stackfile.split('/').slice(1).join(':') : `Stack:${foundTemplate?.name ?? id}.yml`
  // console.log(stackfile);

  let response: string | null

  // console.log(formatted);
  if (await db.hasItem(stackfile))
    response = await db.getItem(stackfile)
  else
    response = convertPortainerTemplatesToDockerCompose([foundTemplate!])

  console.log(response)

  return response
})
