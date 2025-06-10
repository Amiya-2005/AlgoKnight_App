/**
 * Form validation utility functions
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    
    // RFC 5322 compliant regex pattern for email validation
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate password complexity
   * @param {string} password - Password to validate
   * @returns {Object} Validation result with status and message
   */
  export const validatePassword = (password) => {
    if (!password) {
      return { isValid: false, message: 'Password is required' };
    }
    
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    
    // Check for at least one number
    if (!/\d/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    
    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one special character' };
    }
    
    return { isValid: true, message: 'Password meets complexity requirements' };
  };
  
  /**
   * Validate username format
   * @param {string} username - Username to validate
   * @returns {Object} Validation result with status and message
   */
  export const validateUsername = (username) => {
    if (!username) {
      return { isValid: false, message: 'Username is required' };
    }
    
    if (username.length < 3) {
      return { isValid: false, message: 'Username must be at least 3 characters long' };
    }
    
    if (username.length > 20) {
      return { isValid: false, message: 'Username cannot exceed 20 characters' };
    }
    
    // Check for valid username format (alphanumeric and underscore only)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' };
    }
    
    return { isValid: true, message: 'Username is valid' };
  };
  
  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid, false otherwise
   */
  export const isValidUrl = (url) => {
    if (!url) return false;
    
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };
  
  /**
   * Form validation wrapper for React forms
   * @param {Object} values - Form values
   * @param {Object} validationSchema - Validation rules
   * @returns {Object} Errors object
   */
  export const validateForm = (values, validationSchema) => {
    const errors = {};
    
    for (const field in validationSchema) {
      const rules = validationSchema[field];
      
      // Required field validation
      if (rules.required && (!values[field] || values[field].trim() === '')) {
        errors[field] = rules.requiredMessage || `${field} is required`;
        continue;
      }
      
      // Skip other validations if field is empty and not required
      if (!values[field] && !rules.required) {
        continue;
      }
      
      // Min length validation
      if (rules.minLength && values[field].length < rules.minLength) {
        errors[field] = rules.minLengthMessage || `${field} must be at least ${rules.minLength} characters`;
        continue;
      }
      
      // Max length validation
      if (rules.maxLength && values[field].length > rules.maxLength) {
        errors[field] = rules.maxLengthMessage || `${field} cannot exceed ${rules.maxLength} characters`;
        continue;
      }
      
      // Pattern validation
      if (rules.pattern && !rules.pattern.test(values[field])) {
        errors[field] = rules.patternMessage || `${field} has an invalid format`;
        continue;
      }
      
      // Custom validation function
      if (rules.validate) {
        const customError = rules.validate(values[field], values);
        if (customError) {
          errors[field] = customError;
          continue;
        }
      }
    }
    
    return errors;
  };
  
  /**
   * Validate form input on the fly
   * @param {string} value - Input value
   * @param {Object} rules - Validation rules
   * @param {Object} allValues - All form values
   * @returns {string|null} Error message or null if valid
   */
  export const validateInput = (value, rules, allValues = {}) => {
    // Required field validation
    if (rules.required && (!value || value.trim() === '')) {
      return rules.requiredMessage || 'This field is required';
    }
    
    // Skip other validations if field is empty and not required
    if (!value && !rules.required) {
      return null;
    }
    
    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      return rules.minLengthMessage || `Must be at least ${rules.minLength} characters`;
    }
    
    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      return rules.maxLengthMessage || `Cannot exceed ${rules.maxLength} characters`;
    }
    
    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.patternMessage || 'Invalid format';
    }
    
    // Custom validation function
    if (rules.validate) {
      const customError = rules.validate(value, allValues);
      if (customError) {
        return customError;
      }
    }
    
    return null;
  };