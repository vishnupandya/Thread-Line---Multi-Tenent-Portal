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
    <div className="min-h-screen w-full flex bg-white font-sans text-[#1A2433]">
      {/* ============================================================ */}
      {/* 1. LEFT PANEL: THREADLINE BLUE HERO (Wise Reference Layout)   */}
      {/* ============================================================ */}
      <div className="hidden lg:flex lg:w-[40%] xl:w-[35%] bg-[#0B1528] text-white p-12 xl:p-14 flex-col justify-between relative overflow-hidden select-none">
        {/* Top Graphic Pill Accent */}
        <div>
          <div className="inline-flex items-center gap-3 bg-[#132440] p-1.5 pr-5 rounded-full border border-[#1E3760]">
            <div className="w-10 h-10 rounded-full bg-[#0047AB] text-white flex items-center justify-center font-bold shadow-xs">
              <ArrowRight className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[#60A5FA] uppercase tracking-wider">
              ThreadLine Portal
            </span>
          </div>
        </div>

        {/* Bottom Big Bold Headline */}
        <div className="space-y-4">
          <h2 className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-[1.05] uppercase">
            Start Your
            <br />
            <span className="text-[#60A5FA]">Workspace.</span>
          </h2>
          <p className="text-sm text-slate-300 max-w-xs leading-relaxed">
            Create an organization, invite your teammates, and assign tasks with strict role-based isolation.
          </p>
          <div className="pt-2 text-xs text-slate-400">
            <span>Enterprise-grade data security.</span>{" "}
            <span className="text-[#60A5FA] underline font-medium">SOC2 Compliant</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. RIGHT PANEL: CLEAN SHADCN REGISTRATION FORM (Brand Blue)  */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-[420px] mx-auto my-auto space-y-7">
          {/* Brand Logo & Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#0047AB] text-white flex items-center justify-center shadow-xs">
                <Layers className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#1A2433]">
                ThreadLine
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A2433]">
              Create an account.
            </h1>
            <p className="text-sm text-[#6D8196]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#0047AB] underline underline-offset-4 hover:text-[#003A8C]"
              >
                Log in
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 animate-in fade-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-xs font-medium text-[#1A2433] block"
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
                className="w-full h-12 px-4 rounded-xl border border-[#CBD5E1] text-sm text-[#1A2433] placeholder-[#9CA9B8] focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-[#1A2433] block"
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
                className="w-full h-12 px-4 rounded-xl border border-[#CBD5E1] text-sm text-[#1A2433] placeholder-[#9CA9B8] focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-[#1A2433] block"
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
                  className="w-full h-12 px-4 pr-11 rounded-xl border border-[#CBD5E1] text-sm text-[#1A2433] placeholder-[#9CA9B8] focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#9CA9B8] hover:text-[#1A2433] transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-[#6D8196] mt-1">
                Must be at least 8 characters with at least 1 letter and 1 number.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#0047AB] hover:bg-[#003A8C] text-white font-bold text-sm transition-colors cursor-pointer shadow-xs disabled:opacity-50 mt-2 flex items-center justify-center"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-[#6D8196]">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>

        {/* Bottom Minimal Footer */}
        <div className="w-full max-w-[420px] mx-auto text-center text-xs text-[#9CA9B8] pt-6">
          © {new Date().getFullYear()} ThreadLine Multi-Tenant Portal. All rights reserved.
        </div>
      </div>
    </div>
  );
}
