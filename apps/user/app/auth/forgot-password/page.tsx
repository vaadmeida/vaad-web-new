// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/app/schemas/forgot-password.schema";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    try {
      // Handle forgot password logic here
      console.log("Forgot password email:", data.email);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to send reset link:", error);
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
          <span className="text-[#0177AB]">1</span>
          <span className="text-[#9A9EA7]">/2</span>
        </div>

        {/* Logo */}
        <div className="mb-20">
          <Image src="/vaad.svg" alt="VAAD Media" width={120} height={120} />
        </div>

        {/* Forgot Password Form Container */}
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#0D0A19] mb-2">
              Forgot your password?
            </h1>
            <p className="text-sm text-[#9A9EA7] font-medium">
              Don&apos;t worry, we got you! Input your email to receive the reset password link.
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register('email')}
              />

              {/* Send Button */}
              <Button 
                type="submit" 
                fullWidth 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send"}
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
                Check your email
              </h2>
              <p className="text-sm text-[#9A9EA7] font-medium">
                We&apos;ve sent a password reset link to your email address.
              </p>
              <Button
                type="button"
                fullWidth
                size="lg"
                variant="outline"
                onClick={() => setIsSubmitted(false)}
              >
                Send again
              </Button>
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