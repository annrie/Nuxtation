export default defineEventHandler(async (event) => {
  const dataStorage = useStorage("data");
  let pageVisits = (await dataStorage.getItem("pageVisits")) as number;
  const updatePageVisits = pageVisits + 1;
  await dataStorage.setItem("pageVisits", updatePageVisits);
  return {
    pageVisits: updatePageVisits,
  };
});
