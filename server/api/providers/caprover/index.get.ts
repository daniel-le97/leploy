interface OneClickAppsList {
  oneClickApps: {
    name: string
    displayName: string
    description: string
    isOfficial: boolean
    logoUrl: string
    showFullDescription: boolean
  }[]
}
export default defineCachedEventHandler(async (_event) => {
  
  const start = performance.now()
  const db = useDbStorage('templates:caprover')
  const caproverRaw = await db.getItem('list') as OneClickAppsList
  const mapper = caproverRaw.oneClickApps.map(app => ({ ...app, showFullDescription: false }))
  const end = performance.now()
  console.log('time', end - start)

  return mapper
})
