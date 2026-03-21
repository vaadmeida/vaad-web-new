import React from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
  className?: string;
  selectClassName?: string;
}

export default function Select({
  label,
  options,
  error,
  className = "",
  selectClassName = "",
  id,
  ...props
}: SelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={className}>
      {/* Label */}
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-[#9A9EA7] mb-1.5"
      >
        {label}
      </label>

      {/* Select Wrapper */}
      <div className="relative">
        <select
          id={selectId}
          className={`appearance-none w-full px-4 py-4 font-medium text-sm text-[#0D0A19] bg-white border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0088b5] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${selectClassName}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom Dropdown Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Error */}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}