// app/components/PasswordInput.tsx
'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from './Input';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export default function PasswordInput({ 
  label = 'Password', 
  ...props 
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        label={label}
        type={showPassword ? 'text' : 'password'}
        className="relative" // Add relative positioning to the Input's root div
        inputClassName="pr-10" // Add padding to the input to prevent text overlap
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
        style={{ 
          top: '50%',
          transform: 'translateY(-50%)',
          marginTop: '12px' // Half of the label height (24px / 2)
        }}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}