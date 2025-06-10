/**
 * Common formatting utility functions
 */

/**
 * Format date to local string
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
    if (!date) return '';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };
  
  /**
   * Format time to local string
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted time string
   */
  export const formatTime = (date) => {
    if (!date) return '';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(dateObj);
    } catch (error) {
      console.error('Time formatting error:', error);
      return '';
    }
  };
  
  /**
   * Format date and time together
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted date and time string
   */
  export const formatDateTime = (date) => {
    if (!date) return '';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(dateObj);
    } catch (error) {
      console.error('DateTime formatting error:', error);
      return '';
    }
  };
  
  /**
   * Format relative time (e.g. "2 hours ago")
   * @param {string|Date} date - Date to format
   * @returns {string} Relative time string
   */
  export const formatRelativeTime = (date) => {
    if (!date) return '';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const now = new Date();
      const diffInSeconds = Math.floor((now - dateObj) / 1000);
      
      if (diffInSeconds < 60) {
        return 'just now';
      }
      
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
      }
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
      }
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
      }
      
      return formatDate(dateObj);
    } catch (error) {
      console.error('Relative time formatting error:', error);
      return '';
    }
  };
  
  /**
   * Format number with commas (e.g. 1,234,567)
   * @param {number} number - Number to format
   * @returns {string} Formatted number string
   */
  export const formatNumber = (number) => {
    if (number === undefined || number === null) return '';
    
    try {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } catch (error) {
      console.error('Number formatting error:', error);
      return '';
    }
  };
  
  /**
   * Truncate text with ellipsis
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated text
   */
  export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength) + '...';
  };
  
  /**
   * Format contest or challenge duration
   * @param {number} durationInMinutes - Duration in minutes
   * @returns {string} Formatted duration string
   */
  export const formatDuration = (durationInMinutes) => {
    if (!durationInMinutes) return '';
    
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    
    if (hours === 0) {
      return `${minutes} min`;
    } else if (minutes === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} min`;
    }
  };
  
  /**
   * Convert snake_case to Title Case
   * @param {string} text - Snake case text
   * @returns {string} Title case text
   */
  export const snakeToTitleCase = (text) => {
    if (!text) return '';
    
    return text
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  /**
   * Convert kebab-case to Title Case
   * @param {string} text - Kebab case text
   * @returns {string} Title case text
   */
  export const kebabToTitleCase = (text) => {
    if (!text) return '';
    
    return text
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };