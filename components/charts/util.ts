export const compareDates = (
  date1: string | Date,
  date2: string | Date,
): boolean => {
  return new Date(date1).toDateString() === new Date(date2).toDateString();
};

export const mapDates = (el: { date: string }[]) =>
  el.map(entry => new Date(entry.date));

export const getDates = (dates: Date[], limit?: number) => {
  const min_ = dates.reduce((a, b) => (a < b ? a : b));
  const max = dates.reduce((a, b) => (a > b ? a : b));
  const min = limit
    ? new Date(new Date(max).setDate(max.getDate() - limit))
    : min_;

  return getDatesInRange(removeTime(min), removeTime(max));
};

const getDatesInRange = (startDate: Date, endDate: Date) => {
  const dates: { [key: string]: number } = {};

  while (startDate <= endDate) {
    dates[new Date(startDate).toDateString()] = 0;
    startDate.setDate(startDate.getDate() + 1);
  }

  return dates;
};

export const removeTime = (date = new Date()) => {
  return new Date(date.toDateString());
};
