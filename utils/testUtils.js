function randomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function randomDate(start, end) {
  const startDate = start.getTime();
  const endDate = end.getTime();
  const randomTimestamp = startDate + Math.random() * (endDate - startDate);
  return new Date(randomTimestamp);
}

// fullness: [0, 1)
function randomArrayPicks(arr, fullness) {
  return arr.filter(() => Math.random() < fullness);
}

exports.randomString = randomString;
exports.randomDate = randomDate;
exports.randomArrayPicks = randomArrayPicks;
