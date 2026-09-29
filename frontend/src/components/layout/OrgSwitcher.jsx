import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Plus, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import CreateOrgModal from "./CreateOrgModal.jsx";
import { RoleBadge } from "../ui/Badge.jsx";

export default function OrgSwitcher({ isCollapsed = false }) {
  const { organizations, activeOrg, activeRole, switchOrg } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative w-full" ref={dropdownRef}>
        {isCollapsed ? (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            title={`Active Tenant: ${activeOrg?.name || "None"}`}
            className="w-10 h-10 mx-auto rounded-lg bg-[#0047AB] text-white flex items-center justify-center font-bold text-sm uppercase shadow-xs hover:bg-[#003A8C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20"
          >
            {activeOrg ? activeOrg.name.charAt(0) : "T"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-md bg-[#0047AB] text-white flex items-center justify-center shrink-0 font-bold text-xs uppercase shadow-xs">
                {activeOrg ? activeOrg.name.charAt(0) : "T"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#1A2433] truncate leading-tight">
                  {activeOrg ? activeOrg.name : "Select Tenant"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-[#6D8196] font-mono truncate">
                    {activeOrg ? activeOrg.slug : "no-tenant"}
                  </span>
                  {activeRole && <RoleBadge role={activeRole} />}
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#6D8196] shrink-0 ml-1.5" />
          </button>
        )}

        {isOpen && (
          <div
            className={`absolute mt-1.5 bg-white rounded-lg border border-[#E5E9EF] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${
              isCollapsed
                ? "left-full ml-2 top-0 w-64"
                : "top-full left-0 right-0 w-full"
            }`}
          >
            <div className="p-2 border-b border-[#E5E9EF] bg-[#F8FAFC]">
              <span className="text-[10px] font-semibold text-[#6D8196] uppercase tracking-wider px-2">
                Available Organizations ({organizations.length})
              </span>
            </div>

            <div className="max-h-60 overflow-y-auto py-1 divide-y divide-[#E5E9EF]/50">
              {organizations.map((item) => {
                const isSelected = activeOrg && activeOrg._id === item.organization._id;
                return (
                  <button
                    key={item.organization._id}
                    type="button"
                    onClick={() => {
                      switchOrg(item.organization._id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#F1F5F9] transition-colors ${
                      isSelected ? "bg-[#E6F0FB]/60" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#1A2433] truncate">
                          {item.organization.name}
                        </span>
                        <RoleBadge role={item.role} />
                      </div>
                      <span className="text-[10px] text-[#6D8196] font-mono block truncate">
                        {item.organization.slug}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#0047AB] shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            <div className="p-1.5 border-t border-[#E5E9EF] bg-[#F8FAFC]">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setShowCreateModal(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#0047AB] hover:bg-[#E6F0FB] rounded-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Organization</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateOrgModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  );
}
