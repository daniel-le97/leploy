import * as fs from 'node:fs/promises'

const cwd = process.cwd()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 404,
      statusMessage: 'image not found',
    })
  }
  const db = useDbStorage('templates:caprover:logos')
  const hasItem = await db.hasItem(id)
  if (!hasItem) {
    throw createError({
      statusCode: 404,
      statusMessage: 'image not found',
    })
  }

  // let _data: string = ''
  const file = await fs.readFile(`${cwd}/data/templates/caprover/logos/${id}`)

  setResponseHeaders(event, { 'Content-type': 'image/png', 'Content-Length': file.length })

  // createReadSteam()

  return file
  // return await sendWebResponse(event, new Response(file))
  // return sendStream(event, await file.stream())
})
