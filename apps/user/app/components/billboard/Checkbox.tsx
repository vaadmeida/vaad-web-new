// app/components/billboard/Checkbox.tsx
"use client";

interface CheckboxProps {
  label: string;
  count?: number;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Checkbox = ({ label, count, checked = false, onChange }: CheckboxProps) => {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-[#0088b5] focus:ring-[#0088b5]"
        />
        <span className="text-sm text-gray-700 group-hover:text-[#0088b5] transition-colors">
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-400">{count}</span>
      )}
    </label>
  );
};

export default Checkbox;