import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaIdCard,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/shared/PasswordInput";
import ConfirmPasswordInput from "../components/shared/ConfirmPasswordInput";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();
  const [activeTab, setActiveTab] = useState("login"); // 'login', 'signup', or 'forgot'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Login state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup state
  const [signupData, setSignupData] = useState({
    fullName: "",
    studentId: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Password validation state
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSymbol: false,
  });

  // Forgot password state
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
  });
  // Email domain lock state for signup (when auto-generated)
  const [domainLocked, setDomainLocked] = useState(false);

  // Handle login input
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Handle signup input
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });

    // Validate password requirements in real-time
    if (name === "password") {
      validatePassword(value);
    }
  };

  // Validate password requirements
  const validatePassword = (password) => {
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  // Auto-generate email from name and student ID
  const generateEmail = () => {
    const { fullName, studentId } = signupData;
    if (fullName && studentId) {
      // Convert name to lowercase and get first letter + surname
      const nameParts = fullName.toLowerCase().trim().split(" ");

      let emailPrefix = "";

      if (nameParts.length >= 2) {
        // Get  full last name
        emailPrefix = `${nameParts[nameParts.length - 1]}`;
      } else {
        emailPrefix = nameParts[0];
      }

      const local = `${emailPrefix}.${studentId}`;
      const generatedEmail = `${local}@st.futminna.edu.ng`;
      setSignupData({ ...signupData, email: generatedEmail });
      setDomainLocked(true);
    }
  };

  // Handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(loginData.email, loginData.password);

      if (result.success) {
        // Redirect to dashboard or the page they came from
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle signup submit
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!signupData.email.includes("@st.futminna.edu.ng")) {
      setError("Please use a valid FUTMINNA student email!");
      return;
    }

    // Check password requirements
    if (signupData.password.length < 8) {
      setError("Password must be at least 8 characters long!");
      return;
    }

    if (!/[A-Z]/.test(signupData.password)) {
      setError("Password must contain at least one uppercase letter!");
      return;
    }

    if (!/[a-z]/.test(signupData.password)) {
      setError("Password must contain at least one lowercase letter!");
      return;
    }

    if (!/[0-9]/.test(signupData.password)) {
      setError("Password must contain at least one number!");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(signupData.password)) {
      setError("Password must contain at least one symbol!");
      return;
    }

    setLoading(true);

    try {
      const result = await signup({
        name: signupData.fullName,
        email: signupData.email,
        password: signupData.password,
        phone: signupData.phone,
        studentId: signupData.studentId,
      });

      if (result.success) {
        navigate("/verify-email-sent", {
          replace: true,
          state: { email: result.email || signupData.email },
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password input
  const handleForgotPasswordChange = (e) => {
    setForgotPasswordData({
      ...forgotPasswordData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle forgot password submit
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!forgotPasswordData.email) {
      setError("Please enter your email address");
      return;
    }

    if (!forgotPasswordData.email.includes("@st.futminna.edu.ng")) {
      setError("Please use your FUTMINNA student email!");
      return;
    }

    setLoading(true);

    try {
      const authService = (await import("../services/authService")).default;

      const result = await authService.forgotPassword(forgotPasswordData.email);

      if (result.success) {
        setSuccess(
          result.message ||
            "If that email exists, a password reset link has been sent.",
        );
        setError("");
        setForgotPasswordData({
          email: "",
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#7E22CE]/10 via-white to-[#14B8A6]/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="font-zen text-4xl bg-linear-to-r from-[#7E22CE] to-[#14B8A6] text-transparent bg-clip-text mb-2 cursor-pointer hover:scale-105 transition-transform inline-block">
              MKET
            </h1>
          </Link>
          <p className="text-[#4B5563] font-instrument">
            Welcome to the student marketplace
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 font-inter ${
                activeTab === "login"
                  ? "bg-linear-to-r from-[#7E22CE] to-[#14B8A6] text-white shadow-lg"
                  : "text-[#4B5563] hover:text-[#111827]"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 font-inter ${
                activeTab === "signup"
                  ? "bg-linear-to-r from-[#7E22CE] to-[#14B8A6] text-white shadow-lg"
                  : "text-[#4B5563] hover:text-[#111827]"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-600 text-sm font-instrument">{error}</p>
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <p className="text-green-600 text-sm font-instrument">
                {success}
              </p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLoginSubmit}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2 font-inter">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4B5563]" />
                    <input
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                      placeholder="your.studentid@st.futminna.edu.ng"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent transition-all outline-none font-instrument"
                    />
                  </div>
                </div>

                <PasswordInput
                  label="Password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                  required
                  showStrengthIndicator={false}
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#7E22CE] border-gray-300 rounded focus:ring-[#7E22CE]"
                    />
                    <span className="ml-2 text-sm text-[#4B5563] font-instrument">
                      Remember me
                    </span>
                  </label>

                  {/* Forgot Password Link */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("forgot");
                      setError("");
                    }}
                    className="text-sm text-[#7E22CE] hover:text-[#6B1FB8] font-instrument font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-linear-to-r from-[#7E22CE] to-[#14B8A6] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-inter disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Logging in...
                    </>
                  ) : (
                    "Log In"
                  )}
                </motion.button>
              </motion.form>
            ) : activeTab === "signup" ? (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSignupSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2 font-inter">
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4B5563]" />
                    <input
                      type="text"
                      name="fullName"
                      value={signupData.fullName}
                      onChange={handleSignupChange}
                      required
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent transition-all outline-none font-instrument"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2 font-inter">
                    Student ID
                  </label>
                  <div className="relative">
                    <FaIdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4B5563]" />
                    <input
                      type="text"
                      name="studentId"
                      value={signupData.studentId}
                      onChange={handleSignupChange}
                      onBlur={generateEmail}
                      required
                      placeholder="m2203183"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent transition-all outline-none font-instrument"
                    />
                  </div>
                  <p className="text-xs text-[#4B5563] mt-1 font-instrument">
                    Used in your email address (e.g., m2203183)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2 font-inter">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FaIdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4B5563]" />
                    <input
                      type="tel"
                      name="phone"
                      value={signupData.phone}
                      onChange={(e) => {
                        // Only allow numbers and limit to 11 digits
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 11);
                        setSignupData({ ...signupData, phone: value });
                      }}
                      required
                      placeholder="08012345678"
                      maxLength="11"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent transition-all outline-none font-instrument"
                    />
                  </div>
                  <p className="text-xs text-[#4B5563] mt-1 font-instrument">
                    Enter your 11-digit phone number for verification
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2 font-inter">
                    FUTMINNA Email
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4B5563]" />
                    {domainLocked ? (
                      // show editable local-part with locked domain suffix
                      <div className="flex items-center w-full border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                        <input
                          type="text"
                          name="emailLocal"
                          value={(signupData.email || "").split("@")[0]}
                          onChange={(e) => {
                            // strip any @domain part and whitespace to keep only local-part
                            const raw = e.target.value.replace(/@.*$/g, "");
                            const local = raw.replace(/\s+/g, "");
                            setSignupData((prev) => ({
                              ...prev,
                              email: `${local}@st.futminna.edu.ng`,
                            }));
                          }}
                          required
                          placeholder="name.studentid"
                          className="w-full pl-12 pr-4 py-3 focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent transition-all outline-none font-instrument bg-transparent"
                        />
                        <span className="px-3 py-3 text-sm text-[#4B5563] bg-white/0 border-l border-gray-200">
                          @st.futminna.edu.ng
                        </span>
                      </div>
                    ) : (
                      <input
                        type="email"
                        name="email"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        required
                        placeholder="name.studentid@st.futminna.edu.ng"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent transition-all outline-none font-instrument bg-gray-50"
                      />
                    )}
                  </div>
                  <p className="text-xs text-[#14B8A6] mt-1 font-instrument">
                    ✓ Auto-generated from your name and student ID
                  </p>
                </div>

                <PasswordInput
                  label="Password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  onFocus={() => setPasswordFocused(true)}
                  placeholder="Create a strong password"
                  required
                  showStrengthIndicator={false}
                />

                {/* Password Requirements */}
                {passwordFocused && signupData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <p className="text-sm font-inter font-semibold text-gray-700 mb-2">
                      Password Requirements:
                    </p>
                    <div className="space-y-2">
                      {/* Minimum Length */}
                      <div className="flex items-center gap-2">
                        {passwordRequirements.minLength ? (
                          <FaCheck className="text-green-500 text-sm" />
                        ) : (
                          <FaTimes className="text-gray-400 text-sm" />
                        )}
                        <span
                          className={`text-sm font-instrument ${
                            passwordRequirements.minLength
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          At least 8 characters
                        </span>
                      </div>

                      {/* Uppercase Letter */}
                      <div className="flex items-center gap-2">
                        {passwordRequirements.hasUppercase ? (
                          <FaCheck className="text-green-500 text-sm" />
                        ) : (
                          <FaTimes className="text-gray-400 text-sm" />
                        )}
                        <span
                          className={`text-sm font-instrument ${
                            passwordRequirements.hasUppercase
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          One uppercase letter (A-Z)
                        </span>
                      </div>

                      {/* Lowercase Letter */}
                      <div className="flex items-center gap-2">
                        {passwordRequirements.hasLowercase ? (
                          <FaCheck className="text-green-500 text-sm" />
                        ) : (
                          <FaTimes className="text-gray-400 text-sm" />
                        )}
                        <span
                          className={`text-sm font-instrument ${
                            passwordRequirements.hasLowercase
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          One lowercase letter (a-z)
                        </span>
                      </div>

                      {/* Number */}
                      <div className="flex items-center gap-2">
                        {passwordRequirements.hasNumber ? (
                          <FaCheck className="text-green-500 text-sm" />
                        ) : (
                          <FaTimes className="text-gray-400 text-sm" />
                        )}
                        <span
                          className={`text-sm font-instrument ${
                            passwordRequirements.hasNumber
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          One number (0-9)
                        </span>
                      </div>

                      {/* Symbol */}
                      <div className="flex items-center gap-2">
                        {passwordRequirements.hasSymbol ? (
                          <FaCheck className="text-green-500 text-sm" />
                        ) : (
                          <FaTimes className="text-gray-400 text-sm" />
                        )}
                        <span
                          className={`text-sm font-instrument ${
                            passwordRequirements.hasSymbol
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          One symbol (!@#$%^&*)
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <ConfirmPasswordInput
                  label="Confirm Password"
                  name="confirmPassword"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  originalPassword={signupData.password}
                  placeholder="Re-enter your password"
                  required
                />

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    required
                    className="w-4 h-4 mt-1 text-[#7E22CE] border-gray-300 rounded focus:ring-[#7E22CE]"
                  />
                  <label className="ml-2 text-sm text-[#4B5563] font-instrument">
                    I agree to the{" "}
                    <a
                      href="/terms"
                      className="text-[#7E22CE] hover:text-[#14B8A6] font-medium"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-[#7E22CE] hover:text-[#14B8A6] font-medium"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-linear-to-r from-[#7E22CE] to-[#14B8A6] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-inter disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleForgotPasswordSubmit}
                className="space-y-6"
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-inter font-bold text-gray-900">
                    Forgot Password
                  </h3>
                  <p className="text-sm text-gray-600 font-instrument mt-1">
                    Enter your email to receive a reset password link
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2 font-inter">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4B5563]" />
                    <input
                      type="email"
                      name="email"
                      value={forgotPasswordData.email}
                      onChange={handleForgotPasswordChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent transition-all font-instrument"
                      placeholder="your.email@st.futminna.edu.ng"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-linear-to-r from-[#7E22CE] to-[#14B8A6] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-inter disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Sending Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>

                {/* Back to Login */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("login");
                      setError("");
                      setSuccess("");
                    }}
                    className="text-sm text-[#7E22CE] hover:text-[#6B1FB8] font-instrument font-medium transition-colors"
                  >
                    ← Back to Login
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Additional Info */}
          {activeTab !== "forgot" && (
            <div className="mt-6 text-center">
              <p className="text-sm text-[#4B5563] font-instrument">
                {activeTab === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setActiveTab("signup")}
                      className="text-[#7E22CE] hover:text-[#14B8A6] font-semibold"
                    >
                      Sign up now
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setActiveTab("login")}
                      className="text-[#7E22CE] hover:text-[#14B8A6] font-semibold"
                    >
                      Log in here
                    </button>
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-[#4B5563] hover:text-[#7E22CE] font-medium font-inter transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
