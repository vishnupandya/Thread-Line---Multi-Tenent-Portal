import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "./Button.jsx";

export default function ErrorState({
  title = "Failed to load data",
  message = "An unexpected error occurred while fetching information.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-[#FEF2F2] rounded-lg border border-[#FEE2E2]">
      <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#DC2626] mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-[#991B1B]">{title}</h3>
      <p className="text-sm text-[#B91C1C] max-w-md mt-1 mb-5">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" icon={RefreshCw} size="sm">
          Retry
        </Button>
      )}
    </div>
  );
}
