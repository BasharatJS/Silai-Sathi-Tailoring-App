"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, ArrowRight, Loader2 } from "lucide-react";
import {
  sendPhoneOTP,
  verifyPhoneOTP,
  sendEmailOTP,
  clearRecaptcha,
} from "@/services/customerAuthService";
import { ConfirmationResult } from "firebase/auth";

interface CustomerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type LoginMethod = "phone" | "email";
type Step = "input" | "verify";

export default function CustomerLoginModal({
  isOpen,
  onClose,
  onSuccess,
}: CustomerLoginModalProps) {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("phone");
  const [step, setStep] = useState<Step>("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Phone auth states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneOTP, setPhoneOTP] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  // Email auth states
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const resetForm = () => {
    setStep("input");
    setPhoneNumber("");
    setPhoneOTP("");
    setEmail("");
    setEmailSent(false);
    setError("");
    setConfirmationResult(null);
  };

  const handleClose = () => {
    resetForm();
    clearRecaptcha(); // Clear reCAPTCHA when modal closes
    onClose();
  };

  // Phone Login - Send OTP
  const handleSendPhoneOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await sendPhoneOTP(phoneNumber);
      setConfirmationResult(result);
      setStep("verify");
    } catch (err: any) {
      console.error("Phone OTP error:", err);
      setError(err.message || "Failed to send OTP. Please try again.");
      // reCAPTCHA is already cleared in the service, ready for retry
    } finally {
      setLoading(false);
    }
  };

  // Retry phone OTP
  const handleRetryPhoneOTP = () => {
    setError("");
    setPhoneOTP("");
    handleSendPhoneOTP();
  };

  // Phone Login - Verify OTP
  const handleVerifyPhoneOTP = async () => {
    if (!phoneOTP || phoneOTP.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    if (!confirmationResult) {
      setError("Please request OTP first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await verifyPhoneOTP(confirmationResult, phoneOTP);
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Email Login - Send OTP Link
  const handleSendEmailOTP = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await sendEmailOTP(email);
      setEmailSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMethodChange = (method: LoginMethod) => {
    setLoginMethod(method);
    resetForm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-navy to-gold p-6 text-white relative">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
                <p className="text-white/90 text-sm">
                  Login to start your tailoring journey
                </p>
              </div>

              {/* Method Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => handleMethodChange("phone")}
                  className={`flex-1 py-4 flex items-center justify-center gap-2 font-semibold transition-colors relative ${
                    loginMethod === "phone"
                      ? "text-navy bg-gold/10"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Phone className="h-5 w-5" />
                  Phone
                  {loginMethod === "phone" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gold"
                    />
                  )}
                </button>
                <button
                  onClick={() => handleMethodChange("email")}
                  className={`flex-1 py-4 flex items-center justify-center gap-2 font-semibold transition-colors relative ${
                    loginMethod === "email"
                      ? "text-navy bg-gold/10"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Mail className="h-5 w-5" />
                  Email
                  {loginMethod === "email" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gold"
                    />
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Phone Login */}
                {loginMethod === "phone" && (
                  <div className="space-y-4">
                    {step === "input" ? (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <div className="flex gap-2">
                            <div className="px-3 py-3 bg-gray-100 rounded-lg font-semibold text-gray-700">
                              +91
                            </div>
                            <input
                              type="tel"
                              maxLength={10}
                              value={phoneNumber}
                              onChange={(e) =>
                                setPhoneNumber(e.target.value.replace(/\D/g, ""))
                              }
                              placeholder="Enter 10-digit number"
                              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                            />
                          </div>
                        </div>

                        {error && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                          </div>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSendPhoneOTP}
                          disabled={loading}
                          className="w-full py-3 bg-gradient-to-r from-navy to-gold text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Sending OTP...
                            </>
                          ) : error ? (
                            <>
                              Retry
                              <ArrowRight className="h-5 w-5" />
                            </>
                          ) : (
                            <>
                              Send OTP
                              <ArrowRight className="h-5 w-5" />
                            </>
                          )}
                        </motion.button>

                        {/* Invisible reCAPTCHA container */}
                        <div id="recaptcha-container"></div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-sm text-gray-600 mb-4">
                            Enter the 6-digit OTP sent to{" "}
                            <span className="font-semibold">+91 {phoneNumber}</span>
                          </p>
                          <input
                            type="text"
                            maxLength={6}
                            value={phoneOTP}
                            onChange={(e) =>
                              setPhoneOTP(e.target.value.replace(/\D/g, ""))
                            }
                            placeholder="Enter 6-digit OTP"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none text-center text-2xl tracking-widest font-semibold"
                          />
                        </div>

                        {error && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                          </div>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleVerifyPhoneOTP}
                          disabled={loading}
                          className="w-full py-3 bg-gradient-to-r from-navy to-gold text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            "Verify & Login"
                          )}
                        </motion.button>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setStep("input")}
                            className="flex-1 text-sm text-gray-600 hover:text-navy transition-colors"
                          >
                            Change phone number
                          </button>
                          <button
                            onClick={handleRetryPhoneOTP}
                            disabled={loading}
                            className="flex-1 text-sm text-gold hover:text-navy transition-colors font-semibold disabled:opacity-50"
                          >
                            Resend OTP
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Email Login */}
                {loginMethod === "email" && (
                  <div className="space-y-4">
                    {!emailSent ? (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                          />
                        </div>

                        {error && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                          </div>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSendEmailOTP}
                          disabled={loading}
                          className="w-full py-3 bg-gradient-to-r from-navy to-gold text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Login Link
                              <ArrowRight className="h-5 w-5" />
                            </>
                          )}
                        </motion.button>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Mail className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-navy mb-2">
                          Check Your Email!
                        </h3>
                        <p className="text-gray-600 mb-4">
                          We've sent a login link to{" "}
                          <span className="font-semibold">{email}</span>
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Click the link in your email to complete login.
                        </p>
                        <button
                          onClick={() => setEmailSent(false)}
                          className="text-sm text-gold hover:text-navy transition-colors font-semibold"
                        >
                          Use different email
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
