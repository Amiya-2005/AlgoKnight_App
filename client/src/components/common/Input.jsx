import { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Input component with support for different types, sizes, and states
 */
const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  id,
  name,
  value,
  onChange,
  size = 'md',
  fullWidth = false,
  disabled = false,
  readOnly = false,
  required = false,
  className = '',
  ...props
}, ref) => {
  // Generate an ID if one isn't provided
  const inputId = id || name || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  // Base input styles
  const baseStyles = 'block rounded-md border-1 dark:text-gray-200 dark:border-gray-500 border-blue-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm';
  
  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };
  
  // State styles
  const stateStyles = {
    disabled: 'bg-gray-100 cursor-not-allowed opacity-75',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    fullWidth: 'w-full',
  };
  
  // Combine input styles
  const inputClasses = [
    baseStyles,
    sizeStyles[size],
    disabled && stateStyles.disabled,
    fullWidth && stateStyles.fullWidth,
    className,
  ].filter(Boolean).join(' ');
  
  // Container styles
  const containerClasses = [
    'relative',
    fullWidth && 'w-full',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      
      <div className="relative">
      
        <input
          ref={ref}
          type={type}
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={inputClasses}
          {...props}
        />
        
    </div>
    </div>
  );
});

Input.displayName = 'Input';

export default Input;