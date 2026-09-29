import React from "react";

export function StatusBadge({ status }) {
  const config = {
    TODO: { label: "To Do", bg: "bg-[#E6F0FB]", text: "text-[#0047AB]", border: "border-[#BDDDFC]" },
    IN_PROGRESS: { label: "In Progress", bg: "bg-[#FEF3C7]", text: "text-[#B45309]", border: "border-[#FDE68A]" },
    DONE: { label: "Done", bg: "bg-[#DCFCE7]", text: "text-[#15803D]", border: "border-[#BBF7D0]" },
  };

  const current = config[status] || { label: status || "Unknown", bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${current.bg} ${current.text} ${current.border}`}>
      {current.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const config = {
    LOW: { label: "Low", bg: "bg-[#F1F5F9]", text: "text-[#475569]", border: "border-[#E2E8F0]" },
    MEDIUM: { label: "Medium", bg: "bg-[#FEF3C7]", text: "text-[#D97706]", border: "border-[#FDE68A]" },
    HIGH: { label: "High", bg: "bg-[#FEE2E2]", text: "text-[#DC2626]", border: "border-[#FECACA]" },
  };

  const current = config[priority] || { label: priority || "None", bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${current.bg} ${current.text} ${current.border}`}>
      {current.label}
    </span>
  );
}

export function RoleBadge({ role }) {
  const config = {
    OWNER: { label: "Owner", bg: "bg-[#E6F0FB]", text: "text-[#0047AB]", border: "border-[#BDDDFC]" },
    ADMIN: { label: "Admin", bg: "bg-[#F3E8FF]", text: "text-[#7E22CE]", border: "border-[#E9D5FF]" },
    MEMBER: { label: "Member", bg: "bg-[#F1F5F9]", text: "text-[#475569]", border: "border-[#E2E8F0]" },
  };

  const current = config[role] || { label: role || "Member", bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${current.bg} ${current.text} ${current.border}`}>
      {current.label}
    </span>
  );
}
