const formatDate = (date) => {
  // asuming date is a string in the format "2023-05-20T12:00:00.000Z"
  date = new Date(date);
  const separator = date.getMinutes() < 10 ? ':0' : ':';
  const hoursAndMinutes = date.getHours() + separator + date.getMinutes();

  const today = new Date();
  if (date.getDate() !== today.getDate()) {
    const day = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return hoursAndMinutes + ' on ' + day;
  }
  
  return hoursAndMinutes;
};

export { formatDate };