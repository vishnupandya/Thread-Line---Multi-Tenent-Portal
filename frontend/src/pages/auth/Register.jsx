import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Button from "../../components/ui/Button.jsx";
import {
  Mail,
  Lock,
  User,
  Layers,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  FolderKanban,
  Users,
} from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setError("Password must contain at least one letter and at least one number.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await register({ name: name.trim(), email: email.trim(), password });
      if (res.success) {
        showSuccess("Account registered successfully! Welcome to ThreadLine.");
        navigate("/");
      } else {
        setError(res.message || "Registration failed.");
      }
    } catch (err) {
      if (err.details && Array.isArray(err.details) && err.details.length > 0) {
        const detailMessages = err.details.map((d) => d.message).join('. ');
        setError(detailMessages);
      } else {
        setError(err.message || "Registration failed. Email might already exist.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC]">
      {/* ============================================================ */}
      {/* 1. LEFT SIDE: REGISTRATION FORM                              */}
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
            to="/login"
            className="text-xs font-semibold text-[#0047AB] hover:text-[#003A8C] transition-colors"
          >
            Sign in instead →
          </Link>
        </div>

        {/* Center Content / Form */}
        <div className="my-auto max-w-md w-full mx-auto py-8">
          <div className="mb-7">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Create your account
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#64748B]">
              Get started with your isolated organization workspace.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-start gap-2 animate-in fade-in">
              <span className="text-rose-500 font-bold shrink-0">✕</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-xs font-semibold text-[#334155] uppercase tracking-wider"
              >
                Full Name
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 pointer-events-none text-[#94A3B8]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Sarah Connor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#CBD5E1] bg-white text-sm text-[#0F172A] placeholder-[#94A3B8] transition-all focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
                />
              </div>
            </div>

            {/* Email Address */}
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
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#CBD5E1] bg-white text-sm text-[#0F172A] placeholder-[#94A3B8] transition-all focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
                />
              </div>
            </div>

            {/* Password with eye toggle & policy hint */}
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
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <p className="text-[11px] text-[#64748B] mt-1">
                Must be at least 8 characters with at least 1 letter and 1 number.
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full h-10 mt-2 font-semibold shadow-xs"
              icon={ArrowRight}
            >
              Create Account & Enter Portal
            </Button>
          </form>

          <div className="mt-7 text-center text-xs text-[#64748B]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-[#0047AB] hover:underline"
            >
              Sign in
            </Link>
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Multi-Tenant Architecture</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Strict Data Barriers</span>
        </div>

        {/* Architectural Showcase Card */}
        <div className="relative z-10 my-auto space-y-6 max-w-lg">
          <div>
            <span className="text-[#60A5FA] text-xs font-mono font-semibold uppercase tracking-wider">
              Instant Workspace Provisioning
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
              Start with Guaranteed Isolation
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Every organization gets an isolated project domain. Switch tenants
              seamlessly while user memberships and access control stay strictly segregated.
            </p>
          </div>

          {/* Feature Highlight Box */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="text-slate-400 font-mono">CORE CAPABILITIES</span>
              <span className="text-blue-400 font-mono">ENTERPRISE READY</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Hierarchical Isolation Chain</span>
                  <span className="text-slate-400 text-[11px]">
                    Tasks, projects, and memberships are strictly filtered to the verified organization.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Fine-Grained RBAC</span>
                  <span className="text-slate-400 text-[11px]">
                    Owner, Admin, and Member roles with explicit operation limits at both API and UI layers.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <FolderKanban className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Interactive Kanban Workflow</span>
                  <span className="text-slate-400 text-[11px]">
                    Quick move status transitions with real-time project metrics and statistics.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 leading-normal flex items-center gap-1.5 border-t border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Full compliance with OWASP Top 10 multi-tenant isolation standards.</span>
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
