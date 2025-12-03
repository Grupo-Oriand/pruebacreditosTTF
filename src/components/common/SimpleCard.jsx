import React from 'react';

export const SimpleCard = ({ children, className = '' }) => (
  <div className={`glass-panel rounded-2xl ${className}`}>
    {children}
  </div>
);

export const SimpleCardHeader = ({ children, className = '' }) => (
  <div className={`bg-dark-surface/50 p-6 border-b border-dark-border ${className}`}>
    {children}
  </div>
);

export const SimpleCardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const SimpleCardTitle = ({ children, icon, className = '' }) => (
  <h3 className={`text-lg font-bold text-white flex items-center gap-2 ${className}`}>
    {icon}
    {children}
  </h3>
);
