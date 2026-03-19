/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Input from "@/app/components/Input";
import PasswordInput from "@/app/components/PasswordInput";
import Button from "@/app/components/Button";
import Link from "next/link";
import { LoginFormData, loginSchema } from "@/app/schemas/login.schema";
import { useAuthContext } from "@/app/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/contexts/toast-context";

export default function LoginPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { login, isLoading } = useAuthContext();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
  try {
    await login({ email: data.email, password: data.password });
    showToast({
      type: "success",
      message: "Login successful! Welcome back.",
      duration: 3000,
    });
    // Redirect happens in the auth hook
  } catch (error: any) {
    showToast({
      type: "error",
      message: error.message || "Invalid email or password",
      duration: 4000,
    });
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between items-center px-6 sm:px-12 lg:px-24 xl:px-32 py-8 lg:py-12">
        {/* Logo */}
        <div className="mb-8 lg:mb-0">
          <Image src="/vaad.svg" alt="VAAD Media" width={120} height={120} />
        </div>

        {/* Login Form */}
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full lg:mx-0">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#0D0A19] mb-2">
              Welcome back!
            </h1>
            <p className="text-sm text-[#9A9EA7] font-medium">
              Log in to continue book billboards
            </p>
          </div>

          {/* {submitError && (
          <Alert variant="error" onClose={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )} */}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              disabled={isSubmitting || isLoading}
              {...register("email")}
            />

            {/* Password Field */}
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              error={errors.password?.message}
              disabled={isSubmitting || isLoading}
              {...register("password")}
            />

            {/* Error Message */}
            {submitError && (
              <div className="text-sm text-[#E8505B] text-center bg-red-50 p-3 rounded-md">
                {submitError}
              </div>
            )}
            {/* Login Button */}
            <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <Link
              href="/auth/forgot-password"
              className="block text-sm text-[#9A9EA7] hover:text-gray-700 transition-colors font-medium"
            >
              Forgot your password?
            </Link>
            <p className="text-sm text-[#9A9EA7] font-medium">
              Need help?{" "}
              <Link
                href="/contact"
                className="text-primary hover:text-[#007a9e] font-medium transition-colors"
              >
                Contact Support
              </Link>
            </p>
            <p className="text-sm text-[#9A9EA7] font-medium">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-[#0177AB] hover:text-[#007a9e] font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 lg:mt-0 flex flex-col items-center">
          {/* Navigation Links */}
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

          {/* Social Icons */}
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
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-100">
        <div className="absolute inset-0">
          <img
            src="/images/vaad-login-banner.svg"
            alt="Billboard on highway"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text contrast if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}
