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
export default defineEventHandler(async (_event) => {
  const db = useDbStorage('templates:caprover')
  const caproverRaw = await db.getItem('list') as OneClickAppsList
  return caproverRaw.oneClickApps.map(app => ({ ...app, showFullDescription: false }))
})
