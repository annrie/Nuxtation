export const parseDate = (date: string) => {
  const parsed = new Date(date);
  const year = parsed.getFullYear();
  const month = parsed.getMonth() + 1;
  const day = parsed.getDate();
  return `${year}年${month}月${day}日`;
};