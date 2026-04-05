import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  textareaClassName?: string;
  rows?: number;
}

export default function Textarea({ 
  label, 
  error, 
  className = '', 
  textareaClassName = '',
  rows = 4,
  id,
  ...props 
}: TextareaProps) {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={className}>
      <label 
        htmlFor={textareaId} 
        className="block text-sm font-medium text-[#9A9EA7] mb-1.5"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        rows={rows}
        className={`w-full px-4 py-4 font-medium text-sm text-[#0D0A19] bg-white border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0088b5] focus:border-transparent transition-all placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed resize-y ${textareaClassName}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}