export function displayDate(time: string) {
  const year = new Date(time).getFullYear();
  const month = new Date(time).getMonth() + 1;
  const day = new Date(time).getDate();

  return `${year}.${month}.${day}`;
}
