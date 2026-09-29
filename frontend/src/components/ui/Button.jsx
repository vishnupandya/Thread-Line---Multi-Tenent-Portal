import React from "react";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  loading = false,
  disabled = false,
  icon: Icon,
  className = "",
  onClick,
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary:
      "bg-[#0047AB] hover:bg-[#003A8C] text-white focus:ring-[#0047AB]/40 shadow-xs",
    secondary:
      "bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1A2433] border border-[#CBD5E1]/60 focus:ring-slate-300",
    outline:
      "border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#1A2433] focus:ring-slate-300 shadow-2xs",
    danger:
      "bg-[#DC2626] hover:bg-[#B91C1C] text-white focus:ring-rose-500/40 shadow-xs",
    ghost:
      "hover:bg-[#F1F5F9] text-[#6D8196] hover:text-[#1A2433] focus:ring-slate-200",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-1.5 gap-1.5 h-8",
    md: "text-sm px-3.5 py-2 gap-2 h-9",
    lg: "text-base px-4 py-2.5 gap-2.5 h-11",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
