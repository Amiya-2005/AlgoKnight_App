import { useState } from 'react';
import { User, Mail, AlertTriangle, CheckCircle, Bell, HelpCircle, ArrowRight } from 'lucide-react';


// Button Component
const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  dark = false,
  outline = false,
  shadow = false,
  block = false,
  rounded = false,
  fullWidth = false,
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
    active:scale-95 active:outline-none ${size === 'sm' || size === 'xs' ? 'active:ring-1 active:ring-offset-1' : 'active:ring-1 active:ring-offset-1'}
    disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
    cursor-pointer
    ${fullWidth ? 'w-full' : ''}
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
    primary: shadow 
      ? "bg-white text-blue-600 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 active:ring-blue-200" 
      : outline 
        ? "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:ring-blue-200" 
        : "bg-blue-600 text-white hover:bg-blue-700 active:ring-blue-300 shadow-sm hover:shadow",
    secondary: shadow 
      ? "bg-white text-gray-700 shadow-md shadow-gray-200 hover:shadow-lg hover:shadow-gray-300 active:ring-gray-200" 
      : outline 
        ? "border-2 border-gray-500 text-gray-700 hover:bg-gray-50 active:ring-gray-200" 
        : "bg-gray-500 text-white hover:bg-gray-600 active:ring-gray-300 shadow-sm hover:shadow",
    success: shadow 
      ? "bg-white text-emerald-600 shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 active:ring-emerald-200" 
      : outline 
        ? "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 active:ring-emerald-200" 
        : "bg-emerald-600 text-white hover:bg-emerald-700 active:ring-emerald-300 shadow-sm hover:shadow",
    danger: shadow 
      ? "bg-white text-red-600 shadow-md shadow-red-200 hover:shadow-lg hover:shadow-red-300 active:ring-red-200" 
      : outline 
        ? "border-2 border-red-600 text-red-600 hover:bg-red-50 active:ring-red-200" 
        : "bg-red-600 text-white hover:bg-red-700 active:ring-red-300 shadow-sm hover:shadow",
    warning: shadow 
      ? "bg-white text-amber-600 shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-300 active:ring-amber-200" 
      : outline 
        ? "border-2 border-amber-500 text-amber-600 hover:bg-amber-50 active:ring-amber-200" 
        : "bg-amber-500 text-white hover:bg-amber-600 active:ring-amber-300 shadow-sm hover:shadow",
    info: shadow 
      ? "bg-white text-sky-600 shadow-md shadow-sky-200 hover:shadow-lg hover:shadow-sky-300 active:ring-sky-200" 
      : outline 
        ? "border-2 border-sky-500 text-sky-600 hover:bg-sky-50 active:ring-sky-200" 
        : "bg-sky-500 text-white hover:bg-sky-600 active:ring-sky-300 shadow-sm hover:shadow"
  };
  
  // Variant colors in dark mode
  const darkVariants = {
    primary: shadow 
      ? "bg-gray-800 text-blue-400 shadow-md shadow-blue-900/50 hover:shadow-lg hover:shadow-blue-800/50 active:ring-blue-500" 
      : outline 
        ? "border-2 border-blue-400 text-blue-400 hover:bg-blue-900/30 active:ring-blue-500" 
        : "bg-blue-600 text-white hover:bg-blue-500 active:ring-blue-500 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30",
    secondary: shadow 
      ? "bg-gray-900 text-gray-300 shadow-md shadow-gray-800/50 hover:shadow-lg hover:shadow-gray-700/50 active:ring-gray-500" 
      : outline 
        ? "border-2 border-gray-400 text-gray-300 hover:bg-gray-700 active:ring-gray-500" 
        : "bg-gray-700 text-gray-100 hover:bg-gray-600 active:ring-gray-500 shadow-lg shadow-gray-800/20 hover:shadow-gray-700/30",
    success: shadow 
      ? "bg-gray-900 text-emerald-400 shadow-md shadow-emerald-900/50 hover:shadow-lg hover:shadow-emerald-800/50 active:ring-emerald-500" 
      : outline 
        ? "border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-900/30 active:ring-emerald-500" 
        : "bg-emerald-600 text-white hover:bg-emerald-500 active:ring-emerald-500 shadow-lg shadow-emerald-700/20 hover:shadow-emerald-600/30",
    danger: shadow 
      ? "bg-gray-900 text-red-400 shadow-md shadow-red-900/50 hover:shadow-lg hover:shadow-red-800/50 active:ring-red-500" 
      : outline 
        ? "border-2 border-red-400 text-red-400 hover:bg-red-900/30 active:ring-red-500" 
        : "bg-red-600 text-white hover:bg-red-500 active:ring-red-500 shadow-lg shadow-red-700/20 hover:shadow-red-600/30",
    warning: shadow 
      ? "bg-gray-900 text-amber-400 shadow-md shadow-amber-900/50 hover:shadow-lg hover:shadow-amber-800/50 active:ring-amber-500" 
      : outline 
        ? "border-2 border-amber-400 text-amber-400 hover:bg-amber-900/30 active:ring-amber-500" 
        : "bg-amber-500 text-white hover:bg-amber-400 active:ring-amber-500 shadow-lg shadow-amber-600/20 hover:shadow-amber-500/30",
    info: shadow 
      ? "bg-gray-900 text-sky-400 shadow-md shadow-sky-900/50 hover:shadow-lg hover:shadow-sky-800/50 active:ring-sky-500" 
      : outline 
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
    ${glass && variant === 'primary' && !outline && !shadow && dark ? "bg-blue-500/30" : ""}
    ${glass && variant === 'primary' && !outline && !shadow && !dark ? "bg-blue-500/30" : ""}
    ${glass && variant === 'secondary' && !outline && !shadow && dark ? "bg-gray-600/30" : ""}
    ${glass && variant === 'secondary' && !outline && !shadow && !dark ? "bg-gray-400/30" : ""}
    ${glass && variant === 'success' && !outline && !shadow && dark ? "bg-emerald-500/30" : ""}
    ${glass && variant === 'success' && !outline && !shadow && !dark ? "bg-emerald-500/30" : ""}
    ${glass && variant === 'danger' && !outline && !shadow && dark ? "bg-red-500/30" : ""}
    ${glass && variant === 'danger' && !outline && !shadow && !dark ? "bg-red-500/30" : ""}
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

// Demo to showcase all button variants
const ButtonDemo = () => {
  const [isDark, setIsDark] = useState(false);
  
  return (
    <div className={`p-8 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Button Component Demo</h1>
        <Button 
          variant="secondary" 
          onClick={() => setIsDark(!isDark)}
          dark={isDark}
        >
          Toggle {isDark ? 'Light' : 'Dark'} Mode
        </Button>
      </div>
      
      <div className="space-y-8">
        {/* Regular buttons */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Regular Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button dark={isDark}>Primary</Button>
            <Button variant="secondary" dark={isDark}>Secondary</Button>
            <Button variant="success" dark={isDark}>Success</Button>
            <Button variant="danger" dark={isDark}>Danger</Button>
            <Button variant="warning" dark={isDark}>Warning</Button>
            <Button variant="info" dark={isDark}>Info</Button>
          </div>
        </div>
        
        {/* Outline buttons */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Outline Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button outline dark={isDark}>Primary Outline</Button>
            <Button variant="secondary" outline dark={isDark}>Secondary Outline</Button>
            <Button variant="success" outline dark={isDark}>Success Outline</Button>
            <Button variant="danger" outline dark={isDark}>Danger Outline</Button>
            <Button variant="warning" outline dark={isDark}>Warning Outline</Button>
            <Button variant="info" outline dark={isDark}>Info Outline</Button>
          </div>
        </div>
        
        {/* Shadow buttons - new variant */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shadow Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button shadow dark={isDark}>Primary Shadow</Button>
            <Button variant="secondary" shadow dark={isDark}>Secondary Shadow</Button>
            <Button variant="success" shadow dark={isDark}>Success Shadow</Button>
            <Button variant="danger" shadow dark={isDark}>Danger Shadow</Button>
            <Button variant="warning" shadow dark={isDark}>Warning Shadow</Button>
            <Button variant="info" shadow dark={isDark}>Info Shadow</Button>
          </div>
        </div>
        
        {/* Size variations */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Button Sizes</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="xs" dark={isDark}>Extra Small</Button>
            <Button size="sm" dark={isDark}>Small</Button>
            <Button size="md" dark={isDark}>Medium</Button>
            <Button size="lg" dark={isDark}>Large</Button>
            <Button size="xl" dark={isDark}>Extra Large</Button>
          </div>
        </div>
        
        {/* Icon buttons */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Buttons with Icons</h2>
          <div className="flex flex-wrap gap-4">
            <Button icon={<User size={16} />} dark={isDark}>
              User Account
            </Button>
            <Button variant="secondary" icon={<Bell size={16} />} dark={isDark}>
              Notifications
            </Button>
            <Button variant="success" iconRight={<ArrowRight size={16} />} dark={isDark}>
              Next Step
            </Button>
            <Button variant="danger" icon={<AlertTriangle size={16} />} dark={isDark}>
              Alert
            </Button>
            <Button variant="info" iconOnly={<HelpCircle size={16} />} dark={isDark} />
            <Button variant="warning" iconOnly={<Bell size={16} />} dark={isDark} />
          </div>
        </div>
        
        {/* Advanced variations */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Advanced Variations</h2>
          <div className="flex flex-wrap gap-4">
            <Button rounded dark={isDark}>Rounded</Button>
            <Button variant="secondary" glass dark={isDark}>Glass Effect</Button>
            <Button variant="success" shadow rounded dark={isDark}>
              Shadow + Round
            </Button>
            <Button variant="info" loading dark={isDark}>
              Loading...
            </Button>
            <Button variant="danger" disabled dark={isDark}>
              Disabled
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Button;