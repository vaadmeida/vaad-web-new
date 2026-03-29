/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PasswordInput from "@/app/components/PasswordInput";
import Button from "@/app/components/Button";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/app/schemas/reset-password.schema";
import { useAuthContext } from "@/app/contexts/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/app/contexts/toast-context";

export default function ResetPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { resetPassword, isLoading } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  useEffect(() => {
    if (!token) {
      showToast({
        type: 'error',
        message: 'Invalid or missing reset token. Please request a new password reset link.',
        duration: 4000,
      });
      router.push('/auth/forgot-password');
    }
  }, [token, router, showToast]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token,
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!email) {
      showToast({
        type: 'error',
        message: 'Email is missing. Please restart the process.',
        duration: 4000,
      });
      return;
    }

    try {
      await resetPassword({
        email: email,
        token: data.token,
        password: data.password,
      });
      
      setIsSubmitted(true);
      showToast({
        type: 'success',
        message: 'Password reset successful! You can now login with your new password.',
        duration: 5000,
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.message || 'Failed to reset password. Please try again.',
        duration: 4000,
      });
    }
  };

  // Show loading while redirecting if no token
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0088b5]" />
      </div>
    );
  }

  // Navigation data
  const navigationLinks = [
    { name: "About VAAD Media", href: "/about", isNextLink: true },
    { name: "Features", href: "/features", isNextLink: false },
    { name: "Pricing", href: "/pricing", isNextLink: false },
    { name: "Blog", href: "/blog", isNextLink: false },
    { name: "Contact Us", href: "/contact", isNextLink: false },
  ] as const;

  // Social media data
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

  // Reusable style constants
  const linkStyles = {
    base: "text-xs text-[#9A9EA7] hover:text-gray-700 font-semibold transition-colors duration-200",
    social: "text-gray-400 hover:text-gray-600 transition-colors duration-200",
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 sm:px-12 py-8 relative">
        {/* Step Indicator */}
        <div className="absolute top-8 right-8 text-sm font-medium">
          <span className="text-[#9A9EA7]">2</span>
          <span className="text-[#9A9EA7]">/2</span>
        </div>

        {/* Logo */}
        <div className="mb-12">
          <Image src="/vaad.svg" alt="VAAD Media" width={120} height={120} />
        </div>

        {/* Reset Password Form Container */}
        <div className="w-full max-w-md mx-auto">
          {/* Back to Login Link */}
          <Link
            href="/auth/forgot-password"
            className="inline-flex items-center text-sm text-[#9A9EA7] hover:text-[#0177AB] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
          </Link>

          <div className="text-center mb-8">
            <h1 className="sm;text-2xl text-[6vw] font-bold text-[#0D0A19] mb-2">
              Create your new password
            </h1>
            <p className="sm:text-sm text-[3.5vw] text-[#9A9EA7] font-medium">
              Make sure to create new strong password for your account!
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* New Password Field */}
              <PasswordInput
                label="New Password"
                placeholder="Enter your new password"
                error={errors.password?.message}
                {...register("password")}
              />

              {/* Confirm Password Field */}
              <PasswordInput
                label="Confirm New Password"
                placeholder="Re-type your new password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              {/* Password Requirements */}
              {/* <div className="text-xs text-[#9A9EA7] space-y-1">
                <p className="font-medium">Password must contain:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li className={errors.password?.message?.includes('8 characters') ? 'text-[#E8505B]' : ''}>
                    At least 8 characters
                  </li>
                  <li className={errors.password?.message?.includes('uppercase') ? 'text-[#E8505B]' : ''}>
                    One uppercase letter
                  </li>
                  <li className={errors.password?.message?.includes('lowercase') ? 'text-[#E8505B]' : ''}>
                    One lowercase letter
                  </li>
                  <li className={errors.password?.message?.includes('number') ? 'text-[#E8505B]' : ''}>
                    One number
                  </li>
                </ul>
              </div> */}

              {/* Error Message */}
              {submitError && (
                <div className="text-sm text-[#E8505B] text-center bg-red-50 p-3 rounded-md">
                  {submitError}
                </div>
              )}

              {/* Reset Button */}
              <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Resetting..." : "Submit"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
               <img src='/illustrations/reset-password-illustration.svg' width={200} height={200} />
              </div>
              <h2 className="sm:text-xl text-[5.5vw] font-semibold text-[#0D0A19]">
                Success create your new password!
              </h2>
              <p className="sm:text-sm text-[3.5vw] text-[#9A9EA7] font-medium">
                Make sure to save your password in a safe place!
              </p>
              <Link href="/auth/login">
                <Button type="button" fullWidth size="lg">
                  Back to Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="flex sm:flex-row flex-col gap-8 items-center justify-between sm:px-20 pb-8">
        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-4">
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

        {/* Social Icons */}
        <div className="flex justify-center gap-4">
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
    </div>
  );
}
