import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import {
  Layers,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeRole, setActiveRole] = useState("");

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

  const handleDemoLogin = (demoEmail, roleLabel) => {
    setEmail(demoEmail);
    setPassword("Demo@1234");
    setActiveRole(roleLabel);
    setError("");
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-slate-900">
      {/* ============================================================ */}
      {/* 1. LEFT PANEL: MINIMALIST GRAPHIC HERO (Wise Reference Style) */}
      {/* ============================================================ */}
      <div className="hidden lg:flex lg:w-[40%] xl:w-[35%] bg-[#122A14] text-white p-12 xl:p-14 flex-col justify-between relative overflow-hidden select-none">
        {/* Top Graphic Pill Accent */}
        <div>
          <div className="inline-flex items-center gap-3 bg-[#1C3E20] p-1.5 pr-5 rounded-full border border-[#2B542F]">
            <div className="w-10 h-10 rounded-full bg-[#9FE870] text-[#122A14] flex items-center justify-center font-bold">
              <ArrowRight className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[#9FE870] uppercase tracking-wider">
              ThreadLine Portal
            </span>
          </div>
        </div>

        {/* Bottom Big Bold Headline */}
        <div className="space-y-4">
          <h2 className="text-4xl xl:text-5xl font-black tracking-tight text-[#9FE870] leading-[1.05] uppercase">
            Workspaces,
            <br />
            Built Secure.
          </h2>
          <p className="text-sm text-slate-300 max-w-xs leading-relaxed">
            Multi-tenant project execution with guaranteed isolation, granular role hierarchies, and real-time kanban workflow.
          </p>
          <div className="pt-2 text-xs text-slate-400">
            <span>Guaranteed tenant isolation.</span>{" "}
            <span className="text-[#9FE870] underline font-medium">SOC2 Compliant</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. RIGHT PANEL: CLEAN SHADCN AUTH FORM                       */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-[420px] mx-auto my-auto space-y-7">
          {/* Brand Logo & Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#122A14] text-[#9FE870] flex items-center justify-center shadow-xs">
                <Layers className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                ThreadLine
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Welcome back.
            </h1>
            <p className="text-sm text-slate-500">
              New to ThreadLine?{" "}
              <Link
                to="/register"
                className="font-semibold text-slate-900 underline underline-offset-4 hover:text-[#122A14]"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700 animate-in fade-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-slate-700 block"
              >
                Your email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setActiveRole("");
                }}
                required
                className="w-full h-12 px-4 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-slate-700 block"
              >
                Your password
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setActiveRole("");
                  }}
                  required
                  className="w-full h-12 px-4 pr-11 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#9FE870] hover:bg-[#8ee05c] text-[#122A14] font-bold text-sm transition-colors cursor-pointer shadow-xs disabled:opacity-50 mt-2 flex items-center justify-center"
            >
              {loading ? "Signing in..." : "Log in"}
            </button>
          </form>

          {/* Quick Demo Access Pills */}
          <div className="pt-5 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-500 mb-2.5">
              Quick demo accounts:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("demo@example.com", "Owner")}
                className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                  activeRole === "Owner"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                👑 Owner
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("amit@example.com", "Admin")}
                className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                  activeRole === "Admin"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                🛡️ Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("priya@example.com", "Member")}
                className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                  activeRole === "Member"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                👤 Member
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Click any role to fill credentials (Password: <span className="font-mono">Demo@1234</span>)
            </p>
          </div>
        </div>

        {/* Bottom Minimal Footer */}
        <div className="w-full max-w-[420px] mx-auto text-center text-xs text-slate-400 pt-6">
          © {new Date().getFullYear()} ThreadLine Multi-Tenant Portal. All rights reserved.
        </div>
      </div>
    </div>
  );
}
