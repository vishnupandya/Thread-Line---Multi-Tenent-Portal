import React from "react";
import Button from "./Button.jsx";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg border border-dashed border-[#CBD5E1]">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-[#E6F0FB] flex items-center justify-center text-[#0047AB] mb-4">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-base font-semibold text-[#1A2433]">{title}</h3>
      {description && <p className="text-sm text-[#6D8196] max-w-sm mt-1 mb-5">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} icon={actionIcon} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
