import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function Drawer({ isOpen, onClose, title, subtitle, children, width = "max-w-xl" }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-y-0 right-0 flex pl-10 max-w-full">
        <div className={`w-screen ${width} bg-white shadow-2xl border-l border-[#E5E9EF] flex flex-col`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E9EF] bg-[#F8FAFC]">
            <div>
              <h2 className="text-lg font-semibold text-[#1A2433]">{title}</h2>
              {subtitle && <p className="text-xs text-[#6D8196] mt-0.5">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#9CA9B8] hover:text-[#1A2433] rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
