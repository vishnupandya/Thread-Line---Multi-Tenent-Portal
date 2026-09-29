import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(function Select(
  { label, error, options = [], helperText, className = "", id, ...props },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-[#1A2433] uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          className={`w-full h-9 appearance-none rounded-md border text-sm text-[#1A2433] bg-white pl-3 pr-8 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] disabled:bg-[#F8FAFC] disabled:cursor-not-allowed ${
            error ? "border-[#DC2626] focus:border-[#DC2626]" : "border-[#CBD5E1]"
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 pointer-events-none text-[#6D8196]">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <p className="text-xs text-[#DC2626] font-medium">{error}</p>}
      {!error && helperText && <p className="text-xs text-[#6D8196]">{helperText}</p>}
    </div>
  );
});

export default Select;
