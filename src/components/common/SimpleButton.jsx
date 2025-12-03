import React from 'react';

export const SimpleButton = ({ 
  children, 
  variant = 'primary', 
  icon, 
  onClick, 
  type = 'button',
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors',
    danger: 'bg-red-600 hover:bg-red-500 text-white font-medium py-2 px-4 rounded-lg transition-colors',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};
