function formatTime(isoStringDate) {
    const date = new Date(isoStringDate);
    
    // Get hours, minutes, and AM/PM
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes();
    const period = date.getHours() < 12 ? 'AM' : 'PM';
  
    // Format the time
    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
  
    return formattedTime;
  }

export default formatTime;