import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-[#E6F0FB] text-[#0047AB] flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-[#1A2433]">404</h1>
      <h2 className="text-lg font-semibold text-[#1A2433] mt-1">Page not found</h2>
      <p className="text-sm text-[#6D8196] max-w-sm mt-2 mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary" icon={ArrowLeft}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
