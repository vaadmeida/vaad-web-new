/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import Input from "@/app/components/Input";
import PasswordInput from "@/app/components/PasswordInput";
import Button from "@/app/components/Button";
import TermsCheckbox from "@/app/components/TermsCheckbox";
import Link from "next/link";
import {
  registerSchema,
  type RegisterFormData,
} from "@/app/schemas/auth.schema";
import { useAuthContext } from "@/app/contexts/auth-context";
import { useToast } from "@/app/contexts/toast-context";

type RegistrationState = "form" | "success";

export default function SignUpPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registrationState, setRegistrationState] = useState<RegistrationState>("form");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const { signUp, isLoading } = useAuthContext();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      termsAndCondition: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await signUp({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        termsAndCondition: data.termsAndCondition,
      });

      setRegisteredEmail(data.email);
      setRegistrationState("success");
      
      showToast({
        type: "success",
        message: "Account created! Please check your email to verify.",
        duration: 5000,
      });
    } catch (error: any) {
      setSubmitError(error.message || "Registration failed. Please try again.");
      showToast({
        type: "error",
        message: error.message || "Registration failed. Please try again.",
        duration: 4000,
      });
    }
  };

  const handleOpenEmailClient = () => {
    window.location.href = "mailto:";
  };

  // Navigation data
  const navigationLinks = [
    { name: "About VAAD Media", href: "/about", isNextLink: true },
    { name: "Features", href: "/features", isNextLink: false },
    { name: "Pricing", href: "/pricing", isNextLink: false },
    { name: "Blog", href: "/blog", isNextLink: false },
    { name: "Contact Us", href: "/contact", isNextLink: false },
  ] as const;

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com/vaadmedia",
      icon: "/icons/facebook-grey.svg",
      ariaLabel: "Follow us on Facebook",
    },
    {
      name: "Twitter",
      href: "https://twitter.com/vaadmedia",
      icon: "/icons/twitter-grey.svg",
      ariaLabel: "Follow us on Twitter",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/vaadmedia",
      icon: "/icons/linkedin-grey.svg",
      ariaLabel: "Follow us on LinkedIn",
    },
    {
      name: "Instagram",
      href: "https://instagram.com/vaadmedia",
      icon: "/icons/instagram-grey.svg",
      ariaLabel: "Follow us on Instagram",
    },
  ] as const;

  const linkStyles = {
    base: "text-xs text-[#9A9EA7] hover:text-gray-700 font-semibold transition-colors duration-200",
    social: "text-gray-400 hover:text-gray-600 transition-colors duration-200",
  };

  // Cleaned Success View - Less heavy, no pulsing
  const SuccessView = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full lg:mx-0 text-center"
    >
      {/* Simple Clean Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 20, delay: 0.1 }}
        className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-8"
      >
        <CheckCircle2 className="w-11 h-11 text-emerald-600" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="sm:text-3xl text-[6vw] font-bold text-[#0D0A19] mb-4"
      >
        Check Your Email
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="sm:text-base text-[3.5vw] text-[#9A9EA7] font-medium mb-2"
      >
        We've sent a verification link to
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="sm:text-lg text-[4vw] font-semibold text-[#0D0A19] mb-10 break-all px-4"
      >
        {registeredEmail}
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="space-y-3"
      >
        <button
          onClick={handleOpenEmailClient}
          className="group w-full py-4 bg-[#0088b5] hover:bg-[#0077a1] text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
        >
          <Mail className="w-5 h-5" />
          Open Email App
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <Link
          href="/auth/login"
          className="block w-full py-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all text-center"
        >
          Back to Login
        </Link>
      </motion.div>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-10 space-y-4"
      >
        <p className="text-sm text-[#9A9EA7]">
          Wrong email?{" "}
          <button
            onClick={() => setRegistrationState("form")}
            className="text-[#0177AB] hover:text-[#006d91] font-semibold transition-colors"
          >
            Go back and correct it
          </button>
        </p>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-800">
            <strong>Can't find it?</strong> Check your spam or junk folder. 
            The email was sent from <span className="font-mono">noreply@vaadmedia.com</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Side - Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between items-center px-6 sm:px-12 lg:px-24 xl:px-32 py-8 lg:py-12">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 lg:mb-0"
        >
          <Image src="/vaad.svg" alt="VAAD Media" width={120} height={120} />
        </motion.div>

        <AnimatePresence mode="wait">
          {registrationState === "form" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full lg:mx-0"
            >
              <div className="text-center mb-8">
                <h1 className="sm:text-2xl text-[6vw] font-bold text-[#0D0A19] mb-2 mt-5">
                  Get Started with VAAD Media
                </h1>
                <p className="sm:text-sm text-[3.5vw] text-[#9A9EA7] font-medium">
                  Create an account to start booking billboards.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Enter your fullname"
                  error={errors.fullName?.message}
                  disabled={isSubmitting || isLoading}
                  {...register("fullName")}
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  error={errors.email?.message}
                  disabled={isSubmitting || isLoading}
                  {...register("email")}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter your phone number"
                  error={errors.phoneNumber?.message}
                  disabled={isSubmitting || isLoading}
                  {...register("phoneNumber")}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  error={errors.password?.message}
                  disabled={isSubmitting || isLoading}
                  {...register("password")}
                />

                <PasswordInput
                  label="Confirm Password"
                  placeholder="Re-type your password"
                  error={errors.confirmPassword?.message}
                  disabled={isSubmitting || isLoading}
                  {...register("confirmPassword")}
                />

                <TermsCheckbox
                  register={register}
                  error={errors.termsAndCondition?.message}
                />

                {submitError && (
                  <div className="text-sm text-[#E8505B] text-center bg-red-50 p-3 rounded-md">
                    {submitError}
                  </div>
                )}

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="mt-6 mb-12 text-center">
                <p className="sm:text-sm text-[3vw] text-[#9A9EA7] font-medium">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-[#0177AB] hover:text-[#007a9e] font-semibold transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </motion.div>
          ) : (
            <SuccessView key="success" />
          )}
        </AnimatePresence>

        {/* Footer - Only show on form state */}
        {registrationState === "form" && (
          <footer className="mt-8 lg:mt-0 flex flex-col items-center">
            <nav className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
              {navigationLinks.map((link) => {
                const Component = link.isNextLink ? Link : "a";
                return (
                  <Component
                    key={link.name}
                    href={link.href}
                    className={linkStyles.base}
                  >
                    {link.name}
                  </Component>
                );
              })}
            </nav>

            <div className="flex justify-center lg:justify-start gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className={linkStyles.social}
                  aria-label={social.ariaLabel}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={social.icon} alt="" />
                </Link>
              ))}
            </div>
          </footer>
        )}
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-100">
        <div className="absolute inset-0">
          <img
            src="/images/vaad-signup-banner.svg"
            alt="Billboard on highway"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}