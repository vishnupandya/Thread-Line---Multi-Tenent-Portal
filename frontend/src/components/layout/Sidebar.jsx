import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Layers,
  PanelLeftClose,
  X,
} from "lucide-react";
import OrgSwitcher from "./OrgSwitcher.jsx";
import Avatar from "../ui/Avatar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Sidebar({
  isCollapsed = false,
  setIsCollapsed,
  mobileMenuOpen = false,
  setMobileMenuOpen,
}) {
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Dashboard", to: "/", icon: LayoutDashboard, end: true },
    { label: "Projects", to: "/projects", icon: FolderKanban },
    { label: "Members", to: "/members", icon: Users },
    { label: "Settings", to: "/settings", icon: SettingsIcon },
  ];

  const handleNavClick = () => {
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 1. DESKTOP & TABLET SIDEBAR (Hidden on mobile < md)          */}
      {/* ============================================================ */}
      <aside
        className={`hidden md:flex flex-col h-screen bg-[#F8FAFC] border-r border-[#E5E9EF] shrink-0 select-none transition-all duration-200 ${
          isCollapsed ? "w-18" : "w-64"
        }`}
      >
        {/* Brand Header */}
        <div
          className={`p-3.5 border-b border-[#E5E9EF] flex items-center min-h-14 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-lg bg-[#0047AB] flex items-center justify-center text-white shadow-xs shrink-0"
              title="ThreadLine Multi-Tenant Portal"
            >
              <Layers className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-[#1A2433] tracking-tight truncate">
                  ThreadLine
                </h1>
                <p className="text-[10px] text-[#6D8196] font-medium leading-none">
                  Multi-Tenant Portal
                </p>
              </div>
            )}
          </div>

          {/* Collapse Toggle Button - Only shown when expanded */}
          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              title="Collapse sidebar"
              className="p-1.5 text-[#9CA9B8] hover:text-[#1A2433] hover:bg-[#F1F5F9] rounded-md transition-colors cursor-pointer"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tenant selector */}
        <div className="p-3 border-b border-[#E5E9EF]">
          <OrgSwitcher isCollapsed={isCollapsed} />
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2"
                  } rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#E6F0FB] text-[#0047AB] font-semibold shadow-2xs"
                      : "text-[#6D8196] hover:bg-[#F1F5F9] hover:text-[#1A2433]"
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User profile & Logout */}
        <div className="p-3 border-t border-[#E5E9EF] bg-white">
          <div
            className={`flex items-center ${
              isCollapsed ? "flex-col gap-2 justify-center" : "justify-between gap-2"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar name={user?.name} email={user?.email} size="sm" />
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#1A2433] truncate leading-tight">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-[#6D8196] truncate">{user?.email}</p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={logout}
              title="Log out"
              className="p-1.5 text-[#9CA9B8] hover:text-[#DC2626] hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. MOBILE DRAWER SIDEBAR (Visible only when mobileMenuOpen)  */}
      {/* ============================================================ */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-200 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Slide-over menu */}
        <div
          className={`relative w-72 max-w-[80vw] h-full bg-[#F8FAFC] shadow-2xl flex flex-col transition-transform duration-200 transform ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-[#E5E9EF] flex items-center justify-between">
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
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 text-[#9CA9B8] hover:text-[#1A2433] rounded-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Org Switcher */}
          <div className="p-3 border-b border-[#E5E9EF]">
            <OrgSwitcher isCollapsed={false} />
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-[#E6F0FB] text-[#0047AB] font-semibold"
                        : "text-[#6D8196] hover:bg-[#F1F5F9] hover:text-[#1A2433]"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User profile & Logout */}
          <div className="p-3 border-t border-[#E5E9EF] bg-white">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar name={user?.name} email={user?.email} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#1A2433] truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-[#6D8196] truncate">{user?.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                title="Log out"
                className="p-1.5 text-[#9CA9B8] hover:text-[#DC2626] rounded-md cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
