export const getTodayDate = () => {
  const date = new Date();
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

export const getDisplayTime = (date) =>
  `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${`0${date.getMinutes()}`.slice(-2)}`;
