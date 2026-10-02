import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import TopBar from "./TopBar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../ui/Button.jsx";
import Avatar from "../ui/Avatar.jsx";
import CreateOrgModal from "./CreateOrgModal.jsx";
import { Building2, Plus, LogOut, RefreshCw, Mail, Layers } from "lucide-react";
import { useToast } from "../../context/ToastContext.jsx";

export default function AppLayout() {
  const { user, organizations, logout, refreshAuth } = useAuth();
  const { showInfo } = useToast();
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkingInvite, setCheckingInvite] = useState(false);

  // Initialize collapse state from localStorage or default to false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("threadline_sidebar_collapsed") === "true";
  });

  const handleToggleCollapse = (collapsed) => {
    setIsCollapsed(collapsed);
    localStorage.setItem("threadline_sidebar_collapsed", String(collapsed));
  };

  const handleCheckInvites = async () => {
    setCheckingInvite(true);
    try {
      await refreshAuth();
      showInfo("Refreshed workspace memberships.");
    } finally {
      setCheckingInvite(false);
    }
  };

  // If user is logged in but has no organizations, show onboard / waiting view
  if (organizations.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-8">
        {/* Top Header with Brand and Logout */}
        <div className="max-w-2xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0047AB] flex items-center justify-center text-white shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#1A2433]">ThreadLine</h1>
              <p className="text-[10px] text-[#6D8196]">Multi-Tenant Portal</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#DC2626] hover:bg-rose-50 rounded-md border border-rose-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Center Card */}
        <div className="max-w-2xl w-full mx-auto my-8 bg-white rounded-xl border border-[#E5E9EF] p-6 sm:p-10 shadow-sm">
          {/* User Profile Badge */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] border border-[#E5E9EF] mb-8">
            <Avatar name={user?.name} email={user?.email} size="md" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#1A2433] truncate">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] text-[#6D8196] truncate">{user?.email}</p>
            </div>
            <span className="text-[10px] font-semibold text-slate-600 bg-white px-2 py-1 rounded border border-[#E5E9EF]">
              Individual Account
            </span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A2433]">
              Welcome to ThreadLine
            </h2>
            <p className="text-xs sm:text-sm text-[#6D8196] max-w-md mx-auto mt-1.5">
              You are signed in, but you don't belong to any organization workspace yet.
            </p>
          </div>

          {/* Two Pathways: Create Workspace vs Wait for Invite */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pathway A: Create Org */}
            <div className="p-5 rounded-lg border border-[#CBD5E1]/70 hover:border-[#0047AB] transition-colors flex flex-col justify-between bg-white">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#E6F0FB] text-[#0047AB] flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-[#1A2433]">
                  Start New Organization
                </h3>
                <p className="text-xs text-[#6D8196] mt-1 leading-relaxed">
                  Become an Owner. Create a tenant workspace to manage your own projects and invite your team.
                </p>
              </div>

              <div className="mt-5">
                <Button
                  variant="primary"
                  icon={Plus}
                  onClick={() => setShowCreateOrg(true)}
                  className="w-full"
                  size="sm"
                >
                  Create Organization
                </Button>
              </div>
            </div>

            {/* Pathway B: Waiting for Invite */}
            <div className="p-5 rounded-lg border border-[#CBD5E1]/70 flex flex-col justify-between bg-[#F8FAFC]">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 border border-emerald-200">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-[#1A2433]">
                  Waiting for an Invitation?
                </h3>
                <p className="text-xs text-[#6D8196] mt-1 leading-relaxed">
                  If an Admin is adding you as a Member, have them invite <strong className="text-[#1A2433]">{user?.email}</strong>. Once added, click below.
                </p>
              </div>

              <div className="mt-5 flex gap-2">
                <Button
                  variant="outline"
                  icon={RefreshCw}
                  loading={checkingInvite}
                  onClick={handleCheckInvites}
                  className="w-full"
                  size="sm"
                >
                  Check Invitations
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-[#9CA9B8]">
          ThreadLine Multi-Tenant Architecture &bull; Secure JWT Session
        </div>

        <CreateOrgModal
          isOpen={showCreateOrg}
          onClose={() => setShowCreateOrg(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={handleToggleCollapse}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          isCollapsed={isCollapsed}
          setIsCollapsed={handleToggleCollapse}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
