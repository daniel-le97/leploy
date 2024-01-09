// import type{StorageValue} from 'unstorage'

export default defineEventHandler(async (event) => {
  const data = []
  const yamls = await useDbStorage('compose').getKeys()
  for await (const yaml of yamls)
    data.push({ name: yaml, data: await useDbStorage('compose').getItem(yaml) })

  console.log(data)

  return data
})
