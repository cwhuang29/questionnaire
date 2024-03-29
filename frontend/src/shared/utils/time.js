export const getTodayDate = () => {
  const date = new Date();
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

// Backend stores time in the UTC time zone. When the API responses with data such as { "createdAt":"2022-04-25T15:33:13.056Z" } (type is time.Time)
// The JS new Date(value) changes time zone from UTC to user's location
export const getDisplayTime = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  const hour = `0${date.getHours()}`.slice(-2);
  const min = `0${date.getMinutes()}`.slice(-2);

  return `${year}/${month}/${day} ${hour}:${min}`;
};
