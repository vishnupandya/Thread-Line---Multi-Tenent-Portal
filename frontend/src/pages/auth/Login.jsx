import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Button from "../../components/ui/Button.jsx";
import {
  Mail,
  Lock,
  Layers,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDemo, setSelectedDemo] = useState("");

  const { login } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res.success) {
        showSuccess("Logged in successfully!");
        navigate(from, { replace: true });
      } else {
        setError(res.message || "Invalid credentials.");
      }
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, roleKey) => {
    setEmail(demoEmail);
    setPassword("Demo@1234");
    setSelectedDemo(roleKey);
    setError("");
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC]">
      {/* ============================================================ */}
      {/* 1. LEFT SIDE: AUTHENTICATION FORM                            */}
      {/* ============================================================ */}
      <div className="w-full lg:w-[52%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 min-h-screen">
        {/* Top Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#0047AB] text-white flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-[#0F172A] tracking-tight">
                ThreadLine
              </span>
              <span className="ml-2 text-[10px] font-semibold text-[#0047AB] bg-[#E6F0FB] px-2 py-0.5 rounded-full border border-[#BDDDFC]">
                v1.0 Multi-Tenant
              </span>
            </div>
          </div>
          <Link
            to="/register"
            className="text-xs font-semibold text-[#0047AB] hover:text-[#003A8C] transition-colors"
          >
            Create account →
          </Link>
        </div>

        {/* Center Content / Form */}
        <div className="my-auto max-w-md w-full mx-auto py-8">
          <div className="mb-7">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Sign in to your portal
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#64748B]">
              Enter your credentials or choose a quick demo account below.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-start gap-2 animate-in fade-in">
              <span className="text-rose-500 font-bold shrink-0">✕</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-[#334155] uppercase tracking-wider"
              >
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 pointer-events-none text-[#94A3B8]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSelectedDemo("");
                  }}
                  required
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#CBD5E1] bg-white text-sm text-[#0F172A] placeholder-[#94A3B8] transition-all focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
                />
              </div>
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-[#334155] uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 pointer-events-none text-[#94A3B8]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setSelectedDemo("");
                  }}
                  required
                  className="w-full h-10 pl-9 pr-10 rounded-lg border border-[#CBD5E1] bg-white text-sm text-[#0F172A] placeholder-[#94A3B8] transition-all focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#94A3B8] hover:text-[#334155] transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full h-10 mt-2 font-semibold shadow-xs"
              icon={ArrowRight}
            >
              Sign In to Workspace
            </Button>
          </form>

          {/* ============================================================ */}
          {/* Quick 1-Click Demo Accounts Selector                         */}
          {/* ============================================================ */}
          <div className="mt-7 pt-5 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0047AB]" />
                1-Click Demo Accounts
              </span>
              <span className="text-[11px] text-[#94A3B8] font-mono">
                Password: Demo@1234
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {/* Demo 1: Owner */}
              <button
                type="button"
                onClick={() => handleDemoLogin("demo@example.com", "owner")}
                className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                  selectedDemo === "owner"
                    ? "border-[#0047AB] bg-[#E6F0FB]/70 ring-1 ring-[#0047AB]"
                    : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F172A] truncate">
                      demo@example.com
                    </span>
                    <span className="text-[10px] font-semibold text-[#0047AB] bg-[#E6F0FB] px-1.5 py-0.5 rounded border border-[#BDDDFC]">
                      👑 Owner
                    </span>
                  </div>
                  <span className="text-[11px] text-[#64748B] block truncate mt-0.5">
                    Acme Inc & Beta Labs • Full Organization Access
                  </span>
                </div>
                <span className="text-xs text-[#0047AB] font-semibold shrink-0">
                  Select
                </span>
              </button>

              {/* Demo 2: Admin */}
              <button
                type="button"
                onClick={() => handleDemoLogin("amit@example.com", "admin")}
                className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                  selectedDemo === "admin"
                    ? "border-purple-600 bg-purple-50/70 ring-1 ring-purple-600"
                    : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F172A] truncate">
                      amit@example.com
                    </span>
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                      🛡️ Admin
                    </span>
                  </div>
                  <span className="text-[11px] text-[#64748B] block truncate mt-0.5">
                    Acme Inc • Manage Projects & Task Assignments
                  </span>
                </div>
                <span className="text-xs text-purple-700 font-semibold shrink-0">
                  Select
                </span>
              </button>

              {/* Demo 3: Member */}
              <button
                type="button"
                onClick={() => handleDemoLogin("priya@example.com", "member")}
                className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                  selectedDemo === "member"
                    ? "border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600"
                    : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F172A] truncate">
                      priya@example.com
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      👤 Member
                    </span>
                  </div>
                  <span className="text-[11px] text-[#64748B] block truncate mt-0.5">
                    Acme Inc & Beta Labs • View & Move Task Status
                  </span>
                </div>
                <span className="text-xs text-emerald-800 font-semibold shrink-0">
                  Select
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center sm:text-left text-xs text-[#94A3B8]">
          Protected by HttpOnly JWT sessions & hierarchical tenant guards.
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. RIGHT SIDE: UNIQUE ARCHITECTURAL SHOWCASE (Desktop)       */}
      {/* ============================================================ */}
      <div className="hidden lg:flex lg:w-[48%] bg-[#0B132B] text-white p-12 flex-col justify-between relative overflow-hidden border-l border-slate-800">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#94A3B8 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top Header Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Multi-Tenant Security Architecture Active</span>
          </div>
          <span className="text-xs font-mono text-slate-400">SOC2 Type Ready</span>
        </div>

        {/* Architectural Showcase Card */}
        <div className="relative z-10 my-auto space-y-6 max-w-lg">
          <div>
            <span className="text-[#60A5FA] text-xs font-mono font-semibold uppercase tracking-wider">
              Tenant Isolation Engine
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
              Guaranteed Data Segregation
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              ThreadLine enforces a strict hierarchical access chain across every
              layer: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-[#93C5FD] font-mono text-xs">Task → Project → Org</code>.
            </p>
          </div>

          {/* Architectural Diagram Box */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="text-slate-400 font-mono">REQUEST VALIDATION PIPELINE</span>
              <span className="text-emerald-400 font-mono">100% ISOLATED</span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded bg-slate-800/60 border border-slate-700/50">
                <span className="flex items-center gap-2 text-slate-200">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  1. Organization Guard
                </span>
                <span className="text-[#60A5FA]">requireOrgMember()</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-slate-800/60 border border-slate-700/50">
                <span className="flex items-center gap-2 text-slate-200">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  2. Project Guard
                </span>
                <span className="text-purple-400">requireProjectAccess()</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-slate-800/60 border border-slate-700/50">
                <span className="flex items-center gap-2 text-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  3. Task Access Chain
                </span>
                <span className="text-emerald-400">requireTaskAccess()</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 leading-normal flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Cross-tenant tampering attempts immediately return 404 (Zero Information Disclosure).</span>
            </div>
          </div>

          {/* 3 Value Pillars */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-blue-400 mb-1" />
              <p className="text-xs font-bold text-white">404 Barriers</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Zero discovery</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
              <Users className="w-4 h-4 text-purple-400 mb-1" />
              <p className="text-xs font-bold text-white">RBAC Hierarchy</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Owner, Admin, Member</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
              <Lock className="w-4 h-4 text-emerald-400 mb-1" />
              <p className="text-xs font-bold text-white">HttpOnly Cookie</p>
              <p className="text-[11px] text-slate-400 mt-0.5">XSS resistant</p>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="relative z-10 text-xs text-slate-400 flex items-center justify-between">
          <span>ThreadLine Multi-Tenant Core</span>
          <span className="font-mono">Node • Express • MongoDB • React</span>
        </div>
      </div>
    </div>
  );
}
