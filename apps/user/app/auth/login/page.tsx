// app/components/LoginPage.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Input from "@/app/components/Input";
import PasswordInput from "@/app/components/PasswordInput";
import Button from "@/app/components/Button";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("adetonaadeyoke@gmail.com");
  const [password, setPassword] = useState("password123");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic
  };

  // Navigation data
  const navigationLinks = [
    { name: "About VAAD Media", href: "/about", isNextLink: true },
    { name: "Features", href: "/features", isNextLink: false },
    { name: "Pricing", href: "/pricing", isNextLink: false },
    { name: "Blog", href: "/blog", isNextLink: false },
    { name: "Contact Us", href: "/contact", isNextLink: false },
  ] as const;

  // Social media data with Lucide icons
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
          <Image src="/vaad.svg" alt="" width={100} height={100} />
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />

            {/* Password Field */}
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />

            {/* Login Button */}
            <Button type="submit" fullWidth size="lg">
              Login
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <Link
              href="#"
              className="block text-sm text-[#9A9EA7] hover:text-gray-700 transition-colors font-medium"
            >
              Forgot your password?
            </Link>
            <p className="text-sm text-[#9A9EA7] font-medium">
              Need help?{" "}
              <Link
                href="#"
                className="text-[#0177AB] hover:text-[#007a9e] font-medium transition-colors"
              >
                Contact Support
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
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.name}
                  href={social.href}
                  className={linkStyles.social}
                  aria-label={social.ariaLabel}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={Icon} alt="" />
                </Link>
              );
            })}
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
