"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PasswordInput from "@/app/components/PasswordInput";
import Button from "@/app/components/Button";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/app/schemas/reset-password.schema";

export default function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true);
    try {
      // Handle password reset logic here
      console.log("New password:", data.password);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to reset password:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-[#0D0A19] mb-2">
              Create your new password
            </h1>
            <p className="text-sm text-[#9A9EA7] font-medium">
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
                {...register('password')}
              />

              {/* Confirm Password Field */}
              <PasswordInput
                label="Confirm New Password"
                placeholder="Re-type your new password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
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

              {/* Reset Button */}
              <Button 
                type="submit" 
                fullWidth 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Resetting..." : "Submit"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#0D0A19]">
                Password reset successful!
              </h2>
              <p className="text-sm text-[#9A9EA7] font-medium">
                Your password has been successfully reset.
              </p>
              <Link href="/login">
                <Button 
                  type="button" 
                  fullWidth 
                  size="lg"
                >
                  Back to Login
                </Button>
              </Link>
            </div>
          )}


        </div>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between px-20 pb-8">
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