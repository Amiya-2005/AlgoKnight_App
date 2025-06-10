import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card component for displaying content in a contained box with options for header, footer, and hover effects
 */
const Card = ({
  children,
  title,
  subtitle,
  footer,
  variant = 'default',
  hoverable = false,
  className = '',
  ...props
}) => {
  // Base card styles
  const baseStyles = 'rounded-lg overflow-hidden bg-white';
  
  // Variant styles
  const variantStyles = {
    default: 'border border-gray-200 shadow-sm',
    elevated: 'shadow-md',
    outlined: 'border border-gray-300',
    flat: '',
  };
  
  // State styles
  const stateStyles = {
    hoverable: 'transition-all duration-200 hover:shadow-md',
  };
  
  // Combine styles
  const cardClasses = [
    baseStyles,
    variantStyles[variant],
    hoverable && stateStyles.hoverable,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {(title || subtitle) && (
        <div className="px-4 py-3 border-b border-gray-200">
          {title && (
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      )}
      
      <div className="p-4">{children}</div>
      
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  footer: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined', 'flat']),
  hoverable: PropTypes.bool,
  className: PropTypes.string,
};

export default Card;