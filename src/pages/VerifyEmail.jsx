import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import authService from "../services/authService";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const runVerification = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link.");
        return;
      }

      const result = await authService.verifyEmail(token);
      if (result.success) {
        setStatus("success");
        setMessage(result.message || "Email verified successfully.");
        setTimeout(() => {
          navigate("/auth", { replace: true });
        }, 1500);
      } else {
        setStatus("error");
        setMessage(result.message || "Verification failed.");
      }
    };

    runVerification();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#7E22CE]/10 via-white to-[#14B8A6]/10 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-2xl font-bold font-inter text-gray-900">
          Email Verification
        </h1>
        <p
          className={`mt-4 text-sm font-instrument ${
            status === "error" ? "text-red-600" : "text-gray-700"
          }`}
        >
          {message}
        </p>

        {status !== "loading" && (
          <Link
            to="/auth"
            className="inline-block mt-6 text-sm text-[#7E22CE] hover:text-[#6B1FB8] font-instrument font-medium"
          >
            Continue to Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
