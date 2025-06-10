const Avatar = ({ src, userName, size = "md", className = "" }) => {

  console.log("userName", userName);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };
  
  return (
    <div className={`relative inline-flex rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}>
      {src ? (
        <img 
          src={src} 
          alt={`${userName}'s avatar`} 
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-blue-500 text-white font-medium">
          {getInitials(userName)}
        </div>
      )}
      <div className="absolute inset-0 rounded-full shadow-inner"></div>
    </div>
  );
};

export default Avatar;