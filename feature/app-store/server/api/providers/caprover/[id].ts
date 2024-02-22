import yaml from 'yaml'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id)
    return

  const db = useDbStorage('templates:caprover')
  const caproverTemplate = await db.getItem(`apps:${id}`) as CaproverDockerComposeConfig
  let template = JSON.stringify(caproverTemplate.services)
  const variables = caproverTemplate.caproverOneClickApp?.variables ?? []
  variables.push({
    id: '$$cap_appname',
    defaultValue: id,
    label: 'service base name',
  })
  variables?.forEach((variable) => {
    let defaultValue = variable.defaultValue
    const secretFilters = ['password', 'secret', 'encrypt']
    secretFilters.forEach((secret) => {
      if (variable.label.toLowerCase().includes(secret))
        defaultValue = generateSecret()
    })
    template = template.replaceAll(variable.id, defaultValue ?? '')
    // console.log(variable);
  })
  // console.log(template);

  caproverTemplate.services = JSON.parse(template)

  const newTemplate = {
    version: '3',
    services: JSON.parse(template),
  }

  // console.log(caproverTemplate.caproverOneClickApp?.variables)

  return yaml.stringify(newTemplate)
})
