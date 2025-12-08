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
    ghost: 'text-muted-foreground hover:bg-accent hover:text-foreground transition-colors',
    danger: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium py-2 px-4 rounded-lg transition-colors',
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
