import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { RoleBadge } from "../ui/Badge.jsx";
import { ShieldCheck, HardDrive, Menu, PanelLeft } from "lucide-react";

export default function TopBar({
  isCollapsed = false,
  setIsCollapsed,
  setMobileMenuOpen,
}) {
  const { activeOrg, activeRole } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-[#E5E9EF] px-4 sm:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-1.5 rounded-md text-[#6D8196] hover:text-[#1A2433] hover:bg-[#F1F5F9] transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Quick Sidebar Toggle if collapsed */}
        {isCollapsed && (
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            title="Expand sidebar"
            className="hidden md:flex items-center p-1.5 text-[#6D8196] hover:text-[#1A2433] hover:bg-[#F1F5F9] rounded-md transition-colors mr-1"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        {/* Tenant Scope Display */}
        <span className="hidden sm:inline text-xs text-[#6D8196] font-medium">
          Tenant Scope:
        </span>
        <span className="text-xs font-semibold text-[#1A2433] bg-[#F1F5F9] px-2.5 py-1 rounded border border-[#E5E9EF] flex items-center gap-1.5 max-w-[180px] sm:max-w-none truncate">
          <HardDrive className="w-3.5 h-3.5 text-[#0047AB] shrink-0" />
          <span className="truncate">{activeOrg ? activeOrg.name : "None"}</span>
        </span>
        {activeRole && <RoleBadge role={activeRole} />}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="hidden xs:inline font-medium">Tenant Isolated</span>
          <span className="xs:hidden font-medium">Isolated</span>
        </div>
      </div>
    </header>
  );
}
