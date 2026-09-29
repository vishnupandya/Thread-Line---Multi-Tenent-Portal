import React from "react";

export function Shimmer({ className = "" }) {
  return <div className={`animate-shimmer rounded ${className}`} />;
}

export function StatSkeleton() {
  return (
    <div className="p-5 bg-white rounded-lg border border-[#E5E9EF] flex flex-col gap-2">
      <Shimmer className="h-3 w-20" />
      <Shimmer className="h-8 w-16" />
      <Shimmer className="h-3 w-28" />
    </div>
  );
}

export function TableSkeleton({ rows = 4, cols = 4 }) {
  return (
    <div className="w-full bg-white rounded-lg border border-[#E5E9EF] overflow-hidden">
      <div className="p-4 border-b border-[#E5E9EF] bg-[#F8FAFC] flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Shimmer key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-[#E5E9EF]">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <Shimmer key={c} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-5 bg-white rounded-lg border border-[#E5E9EF] flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <Shimmer className="h-5 w-1/2" />
        <Shimmer className="h-5 w-16" />
      </div>
      <Shimmer className="h-3.5 w-full" />
      <Shimmer className="h-3.5 w-3/4" />
      <div className="pt-2 border-t border-[#E5E9EF] flex justify-between items-center mt-2">
        <Shimmer className="h-4 w-20" />
        <Shimmer className="h-6 w-6 rounded-full" />
      </div>
    </div>
  );
}
