export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    
    // Format: YYYY-MM-DD HH:MM
    return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
  };
  
  const padZero = (num) => {
    return num < 10 ? `0${num}` : `${num}`;
  };
  
  export const isOlderThan = (timestamp, days) => {
    const now = Date.now();
    const diff = now - timestamp;
    const dayInMs = 24 * 60 * 60 * 1000;
    
    return diff > (days * dayInMs);
  };
  
  export const getRelativeTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    // Convert to seconds
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) {
      return 'just now';
    }
    
    // Convert to minutes
    const minutes = Math.floor(seconds / 60);
    
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    // Convert to hours
    const hours = Math.floor(minutes / 60);
    
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    // Convert to days
    const days = Math.floor(hours / 24);
    
    if (days < 30) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    
    // If older than 30 days, show formatted date
    return formatDate(timestamp);
  };
  
  export default {
    formatDate,
    isOlderThan,
    getRelativeTime
  };