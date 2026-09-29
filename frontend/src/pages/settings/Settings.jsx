import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Button from "../../components/ui/Button.jsx";
import { RoleBadge } from "../../components/ui/Badge.jsx";
import {
  Building2,
  Copy,
  Check,
  ShieldCheck,
  Database,
  Lock,
  User,
} from "lucide-react";

export default function Settings() {
  const { user, activeOrg, activeRole } = useAuth();
  const { showSuccess } = useToast();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showSuccess("Organization ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-[#1A2433]">Organization Settings</h1>
        <p className="text-xs text-[#6D8196] mt-0.5">
          View configuration and tenant boundary parameters for {activeOrg?.name}.
        </p>
      </div>

      {/* Organization Information Card */}
      <div className="bg-white rounded-lg border border-[#E5E9EF] shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#E5E9EF] bg-[#F8FAFC]">
          <h2 className="text-sm font-semibold text-[#1A2433] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0047AB]" />
            Tenant Identity
          </h2>
          <p className="text-xs text-[#6D8196] mt-0.5">
            Unique tenant identifier and routing attributes.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#6D8196] uppercase tracking-wide block mb-1">
                Organization Name
              </label>
              <div className="p-2.5 rounded-md border border-[#E5E9EF] bg-[#F8FAFC] text-xs font-semibold text-[#1A2433]">
                {activeOrg?.name || "None"}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#6D8196] uppercase tracking-wide block mb-1">
                URL Identifier (Slug)
              </label>
              <div className="p-2.5 rounded-md border border-[#E5E9EF] bg-[#F8FAFC] text-xs font-mono text-[#1A2433]">
                {activeOrg?.slug || "none"}
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#6D8196] uppercase tracking-wide block mb-1">
              Internal Tenant ID (MongoDB _id)
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-2.5 rounded-md border border-[#E5E9EF] bg-[#F8FAFC] text-xs font-mono text-[#1A2433]">
                {activeOrg?._id || "None"}
              </div>
              {activeOrg?._id && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={copied ? Check : Copy}
                  onClick={() => copyToClipboard(activeOrg._id)}
                >
                  {copied ? "Copied" : "Copy ID"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Your Role & Permissions Card */}
      <div className="bg-white rounded-lg border border-[#E5E9EF] shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#E5E9EF] bg-[#F8FAFC]">
          <h2 className="text-sm font-semibold text-[#1A2433] flex items-center gap-2">
            <User className="w-4 h-4 text-[#0047AB]" />
            Your Membership & Role
          </h2>
          <p className="text-xs text-[#6D8196] mt-0.5">
            Your permissions within the currently active tenant organization.
          </p>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between p-4 rounded-lg border border-[#E5E9EF] bg-[#F8FAFC]">
            <div>
              <span className="text-xs font-semibold text-[#1A2433] block">
                {user?.name} ({user?.email})
              </span>
              <span className="text-[11px] text-[#6D8196] mt-0.5 block">
                Assigned tenant privileges
              </span>
            </div>
            <RoleBadge role={activeRole} />
          </div>
        </div>
      </div>

      {/* Tenant Isolation Architecture Card */}
      <div className="bg-white rounded-lg border border-[#E5E9EF] shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#E5E9EF] bg-[#F8FAFC]">
          <h2 className="text-sm font-semibold text-[#1A2433] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Security & Tenant Isolation Architecture
          </h2>
          <p className="text-xs text-[#6D8196] mt-0.5">
            How ThreadLine guarantees data segregation across organizations.
          </p>
        </div>

        <div className="p-6 space-y-4 text-xs text-[#6D8196] leading-relaxed">
          <div className="flex items-start gap-3">
            <Database className="w-4 h-4 text-[#0047AB] mt-0.5 shrink-0" />
            <div>
              <strong className="text-[#1A2433] block">Hierarchical Isolation Chain:</strong>
              <span>
                Every request to project or task data verifies the chain:
                <code className="bg-slate-100 text-[#0047AB] px-1 py-0.5 rounded font-mono ml-1">
                  Task → Project → Organization Membership
                </code>
                . Users cannot access or query documents outside their verified tenant scope.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Lock className="w-4 h-4 text-[#0047AB] mt-0.5 shrink-0" />
            <div>
              <strong className="text-[#1A2433] block">Cookie-based JWT Authentication:</strong>
              <span>
                Session tokens are transmitted using <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">httpOnly</code> cookies, protecting sessions against JavaScript-based XSS attacks.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
