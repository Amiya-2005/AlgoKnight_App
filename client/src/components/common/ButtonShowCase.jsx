// //This is a rough jsx file
// //run it to see all the buttons available and choose suitably

import { useState } from 'react';
import { User, Mail, AlertTriangle, CheckCircle, Bell, HelpCircle, ArrowRight } from 'lucide-react';

const ButtonShowcase = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  return (
    <div className={`p-8 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} min-h-screen transition-colors duration-300`}>
      {/* Mode Toggle */}
      <div className="flex justify-end mb-8">
        <button 
          onClick={toggleMode} 
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
            isDarkMode 
              ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700' 
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm'
          }`}
        >
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      
      <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Custom Button System
      </h1>
      
      {/* Button Variants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Standard Buttons */}
        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Standard Buttons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Button variant="primary" dark={isDarkMode}>Primary Button</Button>
              <Button variant="secondary" dark={isDarkMode}>Secondary Button</Button>
              <Button variant="success" dark={isDarkMode}>Success Button</Button>
              <Button variant="danger" dark={isDarkMode}>Danger Button</Button>
              <Button variant="warning" dark={isDarkMode}>Warning Button</Button>
              <Button variant="info" dark={isDarkMode}>Info Button</Button>
            </div>
            <div className="space-y-4">
              <Button variant="primary" dark={isDarkMode} outline>Primary Outline</Button>
              <Button variant="secondary" dark={isDarkMode} outline>Secondary Outline</Button>
              <Button variant="success" dark={isDarkMode} outline>Success Outline</Button>
              <Button variant="danger" dark={isDarkMode} outline>Danger Outline</Button>
              <Button variant="warning" dark={isDarkMode} outline>Warning Outline</Button>
              <Button variant="info" dark={isDarkMode} outline>Info Outline</Button>
            </div>
          </div>
        </div>
        
        {/* Button Sizes */}
        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Button Sizes
          </h2>
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" dark={isDarkMode} size="xs">Extra Small</Button>
              <Button variant="primary" dark={isDarkMode} size="sm">Small</Button>
              <Button variant="primary" dark={isDarkMode} size="md">Medium</Button>
              <Button variant="primary" dark={isDarkMode} size="lg">Large</Button>
              <Button variant="primary" dark={isDarkMode} size="xl">Extra Large</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="secondary" dark={isDarkMode} size="xs" outline>XS</Button>
              <Button variant="secondary" dark={isDarkMode} size="sm" outline>SM</Button>
              <Button variant="secondary" dark={isDarkMode} size="md" outline>MD</Button>
              <Button variant="secondary" dark={isDarkMode} size="lg" outline>LG</Button>
              <Button variant="secondary" dark={isDarkMode} size="xl" outline>XL</Button>
            </div>
          </div>
        </div>
        
        {/* Icon Buttons */}
        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Icon Buttons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Button variant="primary" dark={isDarkMode} icon={<User />}>Login</Button>
              <Button variant="success" dark={isDarkMode} icon={<CheckCircle />}>Complete</Button>
              <Button variant="danger" dark={isDarkMode} icon={<AlertTriangle />}>Delete</Button>
              <Button variant="info" dark={isDarkMode} icon={<Mail />}>Message</Button>
            </div>
            <div className="space-y-4">
              <Button variant="primary" dark={isDarkMode} iconRight={<ArrowRight />}>Next Step</Button>
              <Button variant="secondary" dark={isDarkMode} outline icon={<Bell />}>Notifications</Button>
              <Button variant="warning" dark={isDarkMode} outline iconRight={<HelpCircle />}>Help</Button>
              <Button variant="info" dark={isDarkMode} iconOnly={<Mail />} aria-label="Mail" />
            </div>
          </div>
        </div>
        
        {/* Special States */}
        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Special States
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
            <div className="space-y-4">
              <Button variant="primary" dark={isDarkMode} disabled>Disabled Button</Button>
              <Button variant="secondary" dark={isDarkMode} disabled outline>Disabled Outline</Button>
              <Button variant="primary" dark={isDarkMode} loading>Loading...</Button>
            </div>
            <div className="space-y-4">
              <Button variant="primary" dark={isDarkMode} block>Full Width Button</Button>
              <Button variant="success" dark={isDarkMode} rounded>Rounded Button</Button>
              <Button variant="danger" dark={isDarkMode} glass>Glass Effect</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Button Component
const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  dark = false,
  outline = false,
  block = false,
  rounded = false,
  glass = false,
  loading = false,
  disabled = false,
  icon = null,
  iconRight = null,
  iconOnly = null,
  className = "",
  ...props 
}) => {
  // Base styles applied to all buttons
  const baseStyles = `
    inline-flex items-center justify-center font-medium transition-all duration-200
    active:scale-95 active:outline-none active:ring-2 active:ring-offset-2
    disabled:opacity-60 disabled:pointer-events-none disabled:active:scale-100
  `;
  
  // Size variations
  const sizeStyles = {
    xs: "text-xs px-2 py-1 rounded",
    sm: "text-sm px-3 py-1.5 rounded",
    md: "text-base px-4 py-2 rounded-md",
    lg: "text-lg px-5 py-2.5 rounded-md",
    xl: "text-xl px-6 py-3 rounded-lg"
  };
  
  // Variant colors in light mode
  const lightVariants = {
    primary: outline 
      ? "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:ring-blue-200" 
      : "bg-blue-600 text-white hover:bg-blue-700 active:ring-blue-300 shadow-sm hover:shadow",
    secondary: outline 
      ? "border-2 border-gray-500 text-gray-700 hover:bg-gray-50 active:ring-gray-200" 
      : "bg-gray-500 text-white hover:bg-gray-600 active:ring-gray-300 shadow-sm hover:shadow",
    success: outline 
      ? "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 active:ring-emerald-200" 
      : "bg-emerald-600 text-white hover:bg-emerald-700 active:ring-emerald-300 shadow-sm hover:shadow",
    danger: outline 
      ? "border-2 border-red-600 text-red-600 hover:bg-red-50 active:ring-red-200" 
      : "bg-red-600 text-white hover:bg-red-700 active:ring-red-300 shadow-sm hover:shadow",
    warning: outline 
      ? "border-2 border-amber-500 text-amber-600 hover:bg-amber-50 active:ring-amber-200" 
      : "bg-amber-500 text-white hover:bg-amber-600 active:ring-amber-300 shadow-sm hover:shadow",
    info: outline 
      ? "border-2 border-sky-500 text-sky-600 hover:bg-sky-50 active:ring-sky-200" 
      : "bg-sky-500 text-white hover:bg-sky-600 active:ring-sky-300 shadow-sm hover:shadow"
  };
  
  // Variant colors in dark mode
  const darkVariants = {
    primary: outline 
      ? "border-2 border-blue-400 text-blue-400 hover:bg-blue-900/30 active:ring-blue-500" 
      : "bg-blue-600 text-white hover:bg-blue-500 active:ring-blue-500 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30",
    secondary: outline 
      ? "border-2 border-gray-400 text-gray-300 hover:bg-gray-700 active:ring-gray-500" 
      : "bg-gray-700 text-gray-100 hover:bg-gray-600 active:ring-gray-500 shadow-lg shadow-gray-800/20 hover:shadow-gray-700/30",
    success: outline 
      ? "border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-900/30 active:ring-emerald-500" 
      : "bg-emerald-600 text-white hover:bg-emerald-500 active:ring-emerald-500 shadow-lg shadow-emerald-700/20 hover:shadow-emerald-600/30",
    danger: outline 
      ? "border-2 border-red-400 text-red-400 hover:bg-red-900/30 active:ring-red-500" 
      : "bg-red-600 text-white hover:bg-red-500 active:ring-red-500 shadow-lg shadow-red-700/20 hover:shadow-red-600/30",
    warning: outline 
      ? "border-2 border-amber-400 text-amber-400 hover:bg-amber-900/30 active:ring-amber-500" 
      : "bg-amber-500 text-white hover:bg-amber-400 active:ring-amber-500 shadow-lg shadow-amber-600/20 hover:shadow-amber-500/30",
    info: outline 
      ? "border-2 border-sky-400 text-sky-400 hover:bg-sky-900/30 active:ring-sky-500" 
      : "bg-sky-600 text-white hover:bg-sky-500 active:ring-sky-500 shadow-lg shadow-sky-700/20 hover:shadow-sky-600/30"
  };
  
  // Choose variant based on dark mode
  const variantStyles = dark ? darkVariants[variant] : lightVariants[variant];
  
  // Additional style variations
  const blockStyles = block ? "w-full" : "";
  const roundedStyles = rounded ? "rounded-full" : "";
  const glassStyles = glass 
    ? dark 
      ? "backdrop-blur-md bg-opacity-20 border border-gray-700" 
      : "backdrop-blur-md bg-opacity-70 border border-white/20"
    : "";
    
  // Loading state
  const loadingStyles = loading ? "cursor-wait opacity-80" : "";
  
  // Icon styling
  const getIconSpacing = () => {
    if (iconOnly) return "";
    if (icon) return "gap-2 justify-center";
    if (iconRight) return "gap-2 justify-center";
    return "";
  };
  
  // Generate the final class name string
  const buttonClasses = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles}
    ${blockStyles}
    ${roundedStyles}
    ${glassStyles}
    ${loadingStyles}
    ${getIconSpacing()}
    ${glass && variant === 'primary' && !outline && dark ? "bg-blue-500/30" : ""}
    ${glass && variant === 'primary' && !outline && !dark ? "bg-blue-500/30" : ""}
    ${glass && variant === 'secondary' && !outline && dark ? "bg-gray-600/30" : ""}
    ${glass && variant === 'secondary' && !outline && !dark ? "bg-gray-400/30" : ""}
    ${glass && variant === 'success' && !outline && dark ? "bg-emerald-500/30" : ""}
    ${glass && variant === 'success' && !outline && !dark ? "bg-emerald-500/30" : ""}
    ${glass && variant === 'danger' && !outline && dark ? "bg-red-500/30" : ""}
    ${glass && variant === 'danger' && !outline && !dark ? "bg-red-500/30" : ""}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  // If iconOnly is provided, render just the icon
  if (iconOnly) {
    return (
      <button 
        className={`${buttonClasses} p-2 ${size === 'xs' ? 'text-sm' : ''} ${size === 'xl' ? 'text-xl p-3' : ''}`} 
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : iconOnly}
      </button>
    );
  }
  
  return (
    <button 
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {icon && !loading && icon}
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
      {iconRight && !loading && iconRight}
    </button>
  );
};

export default ButtonShowcase;