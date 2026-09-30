import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { Mail, Lock, User, Layers, ArrowRight } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-[#0047AB] text-white flex items-center justify-center mx-auto shadow-md">
          <Layers className="w-7 h-7" />
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#1A2433]">
          Create your account
        </h2>
        <p className="mt-1 text-xs text-[#6D8196]">
          Get started with ThreadLine multi-tenant workspace
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
              label="Full Name"
              type="text"
              placeholder="e.g. Sarah Connor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={User}
              required
            />

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
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={Lock}
              helperText="At least 8 characters, with at least 1 letter and 1 number."
              required
            />

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full h-10 mt-2"
              icon={ArrowRight}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-[#6D8196]">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#0047AB] hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
