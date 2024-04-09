export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Pad single digits with leading zero
  const formattedDay = day < 10 ? '0' + day : day;
  const formattedMonth = month < 10 ? '0' + month : month;

  // return formattedDay + '-' + formattedMonth + '-' + year;
  return year + '-' + formattedMonth + '-' + formattedDay;
};

// const originalDate = '2024-03-12T07:00:00.000Z';
// const formattedDate = formatDate(originalDate);
// console.log(formattedDate); // Output: 12-03-2024
