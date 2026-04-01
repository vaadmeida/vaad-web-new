import { InputHTMLAttributes, forwardRef, useState } from "react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: React.ReactNode;
  error?: string;
  color?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, error, color = "#E8505B", className = "", id, onChange, checked, ...props },
    ref,
  ) => {
    const [isChecked, setIsChecked] = useState(checked || false);
    const checkboxId = id || "checkbox";

    // Update local state when controlled prop changes, but not in useEffect
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      if (checked === undefined) {
        // Uncontrolled mode
        setIsChecked(newChecked);
      }
      onChange?.(e);
    };

    // Determine if checked (controlled or uncontrolled)
    const isCheckboxChecked = checked !== undefined ? checked : isChecked;

    // Custom style for dynamic color
    const checkboxStyle = {
      backgroundColor: isCheckboxChecked ? color : undefined,
      borderColor: isCheckboxChecked ? color : undefined,
    };

    return (
      <div className="space-y-1">
        <div className="flex items-start gap-2">
          <div className="relative flex items-center h-5">
            <input
              type="checkbox"
              id={checkboxId}
              ref={ref}
              checked={checked}
              onChange={handleChange}
              className="sr-only"
              {...props}
            />
            <div
              className={`w-4 h-4 rounded-[3px] border transition-all duration-200 cursor-pointer flex items-center justify-center outline-none ring-0 focus:ring-0 focus:outline-none
                ${
                  isCheckboxChecked
                    ? "border-0" // Remove border when checked, color from inline style
                    : "bg-white border-gray-300 hover:border-gray-400"
                }
                ${error ? "border-red-500" : ""}
              `}
              style={isCheckboxChecked ? checkboxStyle : undefined}
              onClick={() => {
                const checkbox = document.getElementById(
                  checkboxId,
                ) as HTMLInputElement;
                checkbox.click();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const checkbox = document.getElementById(
                    checkboxId,
                  ) as HTMLInputElement;
                  checkbox.click();
                }
              }}
              role="checkbox"
              aria-checked={isCheckboxChecked}
              tabIndex={0}
            >
              {isCheckboxChecked && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </div>
          {label && (
            <label
              htmlFor={checkboxId}
              className="text-xs text-[#9A9EA7] font-medium leading-5 cursor-pointer"
              onClick={() => {
                const checkbox = document.getElementById(
                  checkboxId,
                ) as HTMLInputElement;
                checkbox.click();
              }}
            >
              {label}
            </label>
          )}
        </div>
        {error && <p className="text-xs text-[#E8505B] ml-6">{error}</p>}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;