import { writeFile } from 'node:fs/promises'

function removeSpecialCharacters(inputString: string): string {
  // Use a regular expression to match all non-alphanumeric characters
  const regex = /[^a-zA-Z0-9]/g

  // Replace matched characters with an empty string
  const resultString = inputString.replace(regex, '')

  return resultString.toLowerCase()
}
// const logos = read
export default defineEventHandler(async (event) => {
  const start = performance.now()
  const logos = (await useDbStorage('templates').getItem('logos.json') as { logos: { name: string, path: string, formatted: string }[] }).logos
  const templates = await useDbStorage('templates:portainer').getItem('template.json') as unknown as ITemplateFile
  const apps = templates.templates
  // await writeFile('./cats.json', JSON.stringify(cats, null, 2))
  return apps
})
