import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PasswordInput from "../components/shared/PasswordInput";
import ConfirmPasswordInput from "../components/shared/ConfirmPasswordInput";
import authService from "../services/authService";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid reset link.");
      return;
    }

    if (form.newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await authService.resetPasswordWithToken(
      token,
      form.newPassword,
    );

    if (result.success) {
      setSuccess(result.message || "Password reset successful.");
      setTimeout(() => {
        navigate("/auth", { replace: true });
      }, 1500);
    } else {
      setError(result.message || "Failed to reset password.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#7E22CE]/10 via-white to-[#14B8A6]/10 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold font-inter text-gray-900 text-center">
          Set New Password
        </h1>
        <p className="text-sm text-gray-600 font-instrument mt-2 text-center">
          Enter your new password below.
        </p>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-instrument">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-instrument">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <PasswordInput
            label="New Password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            required
          />

          <ConfirmPasswordInput
            label="Confirm New Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            originalPassword={form.newPassword}
            placeholder="Re-enter new password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-inter font-semibold bg-linear-to-r from-[#7E22CE] to-[#14B8A6] disabled:opacity-60"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        <Link
          to="/auth"
          className="block text-center mt-4 text-sm text-[#7E22CE] hover:text-[#6B1FB8] font-instrument font-medium"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
