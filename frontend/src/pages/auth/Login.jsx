import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { Mail, Lock, Layers, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleDemoLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword("Demo@1234");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-[#0047AB] text-white flex items-center justify-center mx-auto shadow-md">
          <Layers className="w-7 h-7" />
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#1A2433]">
          Sign in to ThreadLine
        </h2>
        <p className="mt-1 text-xs text-[#6D8196]">
          Multi-tenant project portal with strict tenant isolation
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#E5E9EF] rounded-xl sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-md bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={Mail}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={Lock}
              required
            />

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full h-10 mt-2 cursor-pointer"
              icon={ArrowRight}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-[#E5E9EF]">
            <p className="text-[11px] font-semibold text-[#6D8196] uppercase tracking-wider mb-2.5">
              Quick Demo Accounts (Password: Demo@1234)
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("demo@example.com")}
                className="w-full text-left p-2.5 rounded-md border border-[#E5E9EF] hover:bg-[#F8FAFC] hover:border-[#0047AB] transition-colors flex items-center justify-between text-xs cursor-pointer"
              >
                <div>
                  <span className="font-semibold text-[#1A2433]">demo@example.com</span>
                  <span className="text-[10px] text-[#6D8196] block">Acme Inc & Beta Labs (Owner)</span>
                </div>
                <span className="text-[10px] font-semibold text-[#0047AB] bg-[#E6F0FB] px-2 py-0.5 rounded border border-[#BDDDFC]">
                  Owner
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("amit@example.com")}
                className="w-full text-left p-2.5 rounded-md border border-[#E5E9EF] hover:bg-[#F8FAFC] hover:border-[#0047AB] transition-colors flex items-center justify-between text-xs cursor-pointer"
              >
                <div>
                  <span className="font-semibold text-[#1A2433]">amit@example.com</span>
                  <span className="text-[10px] text-[#6D8196] block">Acme Inc (Admin)</span>
                </div>
                <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Admin
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("priya@example.com")}
                className="w-full text-left p-2.5 rounded-md border border-[#E5E9EF] hover:bg-[#F8FAFC] hover:border-[#0047AB] transition-colors flex items-center justify-between text-xs cursor-pointer"
              >
                <div>
                  <span className="font-semibold text-[#1A2433]">priya@example.com</span>
                  <span className="text-[10px] text-[#6D8196] block">Acme Inc & Beta Labs (Member)</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Member
                </span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#6D8196]">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-[#0047AB] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
