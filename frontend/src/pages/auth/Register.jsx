import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import {
  Layers,
  ArrowRight,
  Eye,
  EyeOff,
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
            Start Your
            <br />
            Workspace.
          </h2>
          <p className="text-sm text-slate-300 max-w-xs leading-relaxed">
            Create an organization, invite your teammates, and assign tasks with strict role-based isolation.
          </p>
          <div className="pt-2 text-xs text-slate-400">
            <span>Enterprise-grade data security.</span>{" "}
            <span className="text-[#9FE870] underline font-medium">SOC2 Compliant</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. RIGHT PANEL: CLEAN SHADCN REGISTRATION FORM               */}
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
              Create an account.
            </h1>
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-slate-900 underline underline-offset-4 hover:text-[#122A14]"
              >
                Log in
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
                htmlFor="name"
                className="text-xs font-medium text-slate-700 block"
              >
                Your full name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Sarah Connor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-12 px-4 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
              />
            </div>

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
                onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <p className="text-[11px] text-slate-500 mt-1">
                Must be at least 8 characters with at least 1 letter and 1 number.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#9FE870] hover:bg-[#8ee05c] text-[#122A14] font-bold text-sm transition-colors cursor-pointer shadow-xs disabled:opacity-50 mt-2 flex items-center justify-center"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
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
