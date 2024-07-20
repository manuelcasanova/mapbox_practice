
const toLocalTimeStamp = (utcTimestamp) => {
  let utcDate = new Date(utcTimestamp);
  let timezoneOffset = utcDate.getTimezoneOffset();
  let localTimestamp = utcTimestamp + timezoneOffset * 60 * 1000;
  return localTimestamp
};

export default toLocalTimeStamp;