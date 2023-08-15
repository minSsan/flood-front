export interface FormattedDateInfo {
  year: number;
  month: number;
  date: number;
  hours: number;
  minutes: number;
}

export const DateTimeFormatter = (date: string): FormattedDateInfo => {
  const parsedDate = date.split(" ");

  const dateString = parsedDate[0]; // "2023:07:27"
  const timeString = parsedDate[1]; // "13:47:18"

  // * dates
  const dateInfoArray = dateString.split(":");
  // * times
  const timeInfoArray = timeString.split(":");

  return {
    year: parseInt(dateInfoArray[0]),
    month: parseInt(dateInfoArray[1]),
    date: parseInt(dateInfoArray[2]),
    hours: parseInt(timeInfoArray[0]),
    minutes: parseInt(timeInfoArray[1]),
  };
};
