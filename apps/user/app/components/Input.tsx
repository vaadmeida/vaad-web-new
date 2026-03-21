import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  inputClassName?: string; // Add this prop for input-specific classes
}

export default function Input({ 
  label, 
  error, 
  className = '', 
  inputClassName = '', // New prop
  id,
  ...props 
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={className}>
      <label 
        htmlFor={inputId} 
        className="block text-sm font-medium text-[#9A9EA7] mb-1.5"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full px-4 py-4 font-medium text-sm text-[#0D0A19] bg-white border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0088b5] focus:border-transparent transition-all placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}