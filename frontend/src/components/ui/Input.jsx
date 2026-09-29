import React, { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, helperText, leftIcon: LeftIcon, rightIcon: RightIcon, className = "", id, ...props },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-[#1A2433] uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {LeftIcon && (
          <div className="absolute left-3 pointer-events-none text-[#9CA9B8]">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full h-9 rounded-md border text-sm text-[#1A2433] placeholder-[#9CA9B8] bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] disabled:bg-[#F8FAFC] disabled:cursor-not-allowed ${
            LeftIcon ? "pl-9" : "pl-3"
          } ${RightIcon ? "pr-9" : "pr-3"} ${
            error ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-red-100" : "border-[#CBD5E1]"
          } ${className}`}
          {...props}
        />
        {RightIcon && (
          <div className="absolute right-3 pointer-events-none text-[#9CA9B8]">
            <RightIcon className="w-4 h-4" />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-[#DC2626] font-medium">{error}</p>}
      {!error && helperText && <p className="text-xs text-[#6D8196]">{helperText}</p>}
    </div>
  );
});

export default Input;
