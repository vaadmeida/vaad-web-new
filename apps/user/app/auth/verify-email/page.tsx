/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/app/contexts/toast-context";
import { authService } from "@/app/lib/auth/auth-service";
import { TokenService } from "@/app/lib/auth/token-service";
import Image from "next/image";

type VerificationStatus = "idle" | "verifying" | "success" | "error";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleVerification = useCallback(async () => {
    if (!token || !email) {
      setStatus("error");
      setErrorMessage("Invalid verification link. Missing token or email.");
      return;
    }

    setStatus("verifying");

    try {
      const tokens = await authService.generateTokens({
        email: email,
        token: token,
      });

      TokenService.setTokens(tokens);
      setStatus("success");

      showToast({
        type: "success",
        message: "Email verified successfully! Welcome to VAAD Media.",
        duration: 5000,
      });

      // Delay redirect for success animation
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(
        error.message ||
          "Verification failed. The link may have expired or is invalid.",
      );
      showToast({
        type: "error",
        message: error.message || "Email verification failed.",
        duration: 4000,
      });
    }
  }, [token, email, router, showToast]);

  // Auto-verify if token and email present
  useEffect(() => {
    if (token && email && status === "idle") {
      const timer = setTimeout(() => {
        handleVerification();
      }, 800); // Small delay for visual effect
      return () => clearTimeout(timer);
    }
  }, [token, email, status, handleVerification]);

  // Missing params state
  if (!token || !email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 text-center border border-slate-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">
              Invalid Link
            </h1>
            <p className="text-slate-500 mb-8 leading-relaxed">
              This verification link is invalid or has expired. Please request a
              new verification email.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300"
            >
              Go to Login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <Image
            src="/vaad.svg"
            alt="VAAD Media"
            width={120}
            height={120}
            className="mx-auto mb-4"
            priority
          />
        </motion.div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-white/50">
          <AnimatePresence mode="wait">
            {/* Idle State */}
            {status === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#0088b5]/10 to-[#0088b5]/5 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <Mail className="w-10 h-10 text-[#0088b5]" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#0088b5]/20"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-3">
                  Verify Your Email
                </h1>
                <p className="text-slate-500 mb-2 leading-relaxed">
                  Ready to verify
                </p>
                <p className="text-[#0088b5] font-medium mb-8 truncate px-4">
                  {email}
                </p>

                <button
                  onClick={handleVerification}
                  className="group w-full py-4 bg-gradient-to-r from-[#0088b5] to-[#006d91] text-white rounded-xl font-semibold shadow-lg shadow-[#0088b5]/25 hover:shadow-[#0088b5]/40 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Verify Email
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {/* Verifying State */}
            {status === "verifying" && (
              <motion.div
                key="verifying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <motion.div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-[#0088b5] border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[#0088b5]" />
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Verifying...
                </h2>
                <p className="text-slate-500">
                  Please wait while we confirm your email
                </p>
              </motion.div>
            )}

            {/* Success State */}
            {status === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </motion.div>

                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Welcome Aboard!
                </h2>
                <p className="text-slate-500 mb-6">
                  Your email has been verified successfully. Redirecting to
                  dashboard...
                </p>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#0088b5] to-green-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  Verification Failed
                </h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  {errorMessage}
                </p>

                <div className="space-y-3">
                  <button
                    onClick={handleVerification}
                    className="w-full py-4 bg-[#0088b5] text-white rounded-xl font-semibold hover:bg-[#006d91] transition-colors flex items-center justify-center gap-2"
                  >
                    <Loader2 className="w-4 h-4" />
                    Try Again
                  </button>

                  <Link
                    href="/auth/login"
                    className="block w-full py-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Back to Login
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-400 text-sm mt-8"
        >
          Secured by VAAD Media
        </motion.p>
      </motion.div>
    </div>
  );
}
