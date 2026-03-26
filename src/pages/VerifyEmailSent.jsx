import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import authService from "../services/authService";

const VerifyEmailSent = () => {
  const location = useLocation();
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const email = location.state?.email || "";

  const handleResend = async () => {
    if (!email) {
      setError("No email found. Please sign up again.");
      return;
    }

    setSending(true);
    setError("");
    setMessage("");

    const result = await authService.resendVerificationEmail(email);
    if (result.success) {
      setMessage(result.message || "Verification link has been sent.");
    } else {
      setError(result.message || "Failed to resend verification email.");
    }

    setSending(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#7E22CE]/10 via-white to-[#14B8A6]/10 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold font-inter text-gray-900 text-center">
          Verify Your Email
        </h1>
        <p className="text-sm text-gray-600 font-instrument mt-3 text-center leading-relaxed">
          We sent a verification link to
          <span className="font-semibold text-gray-900">
            {" "}
            {email || "your email"}
          </span>
          . Open your inbox and click the link to verify your account.
        </p>

        {message && (
          <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-instrument">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-instrument">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleResend}
          disabled={sending}
          className="mt-6 w-full py-3 rounded-lg text-white font-inter font-semibold bg-linear-to-r from-[#7E22CE] to-[#14B8A6] disabled:opacity-60"
        >
          {sending ? "Resending..." : "Resend Verification Link"}
        </button>

        <Link
          to="/auth"
          className="block text-center mt-4 text-sm text-[#7E22CE] hover:text-[#6B1FB8] font-instrument font-medium"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailSent;
