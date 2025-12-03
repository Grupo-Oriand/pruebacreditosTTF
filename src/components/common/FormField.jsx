import React from 'react';

export const FormField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  required = false,
  placeholder = '',
  className = ''
}) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
    )}
    <input
      type={type}
      required={required}
      placeholder={placeholder}
      className="input-field pl-4"
      value={value}
      onChange={onChange}
    />
  </div>
);
