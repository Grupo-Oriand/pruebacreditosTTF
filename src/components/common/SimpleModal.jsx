import React from 'react';
import { X } from 'lucide-react';

export const SimpleModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-bg border border-dark-border rounded-2xl w-full max-w-lg shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-dark-border flex justify-between items-center sticky top-0 bg-dark-bg z-10">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
