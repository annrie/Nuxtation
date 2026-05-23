export default defineEventHandler(async (_event) => {
  const dataStorage = useStorage('data')
  const pageVisits = (await dataStorage.getItem('pageVisits')) as number
  const updatePageVisits = pageVisits + 1
  await dataStorage.setItem('pageVisits', updatePageVisits)
  return {
    pageVisits: updatePageVisits,
  }
})
