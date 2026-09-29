import React from "react";

export default function Avatar({ name = "", email = "", size = "md", className = "" }) {
  const displayName = name || (email ? email.split("@")[0] : "?");
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("") || "?";

  const sizes = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-7 h-7 text-xs",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm font-semibold",
  };

  const colors = [
    "bg-blue-100 text-blue-700 border-blue-200",
    "bg-indigo-100 text-indigo-700 border-indigo-200",
    "bg-violet-100 text-violet-700 border-violet-200",
    "bg-amber-100 text-amber-800 border-amber-200",
    "bg-teal-100 text-teal-800 border-teal-200",
    "bg-rose-100 text-rose-800 border-rose-200",
  ];
  let hash = 0;
  for (let i = 0; i < displayName.length; i++) {
    hash = displayName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorClass = colors[Math.abs(hash) % colors.length];

  return (
    <div
      title={name ? `${name} (${email})` : email}
      className={`rounded-full shrink-0 flex items-center justify-center font-medium border select-none ${colorClass} ${sizes[size] || sizes.md} ${className}`}
    >
      {initials}
    </div>
  );
}
