import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

/**
 * Loading component with different types and sizes for displaying loading states
 */
const Buffer = ({
  type = 'spinner',
  text,
  fullScreen = false,
  fadeOut = false, //initial state -> to be updated by parent after loading done
  className = '',
}) => {

  const { theme } = useContext(ThemeContext);
  // Size mapping
  const sizeMap = {
    spinner: 'h-8 w-8',
    dots: 'h-2.5 w-2.5',
    pulse: 'h-10 w-10',
  };


  // Container styles
  const containerClasses = [
    'flex items-center justify-center',
    fullScreen && 'fixed inset-0 bg-opacity-75 z-50',
    theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50',
    className,
    'transition-opacity duration-500',
    fadeOut ? 'opacity-0' : 'opacity-100'
  ].filter(Boolean).join(' ');

  // Loading variants
  const renderBufferingIndicator = () => {
    switch (type) {
      case 'spinner':
        return (
          <svg
            className={`animate-spin ${sizeMap.spinner} text-blue-600`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        );

      case 'dots':
        return (
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`${sizeMap.dots} rounded-full ${theme==='dark' ? 'bg-blue-100' : 'bg-blue-500'} animate-bounce`}
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.8s'
                }}
              ></div>
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div
            className={`${sizeMap.pulse} bg-blue-600 rounded-full animate-pulse`}
          ></div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center justify-center">
        {renderBufferingIndicator()}
        {text && (
          <span className={`mt-2 ${theme==='dark' ? 'text-blue-100' : 'text-blue-500'} text-sm font-medium`}>
            {text}
          </span>
        )}
      </div>
    </div>
  );
};


export default Buffer;