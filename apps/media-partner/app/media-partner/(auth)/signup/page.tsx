/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
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

// Success View - Defined OUTSIDE the component to prevent recreation on each render
const SuccessView = ({ 
  registeredEmail, 
  onBackToForm 
}: { 
  registeredEmail: string; 
  onBackToForm: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full lg:mx-0 text-center"
  >
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
      We&apos;ve sent a verification link to
    </motion.p>

    <motion.p
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="sm:text-lg text-[4vw] font-semibold text-[#0D0A19] mb-10 break-all px-4"
    >
      {registeredEmail}
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="space-y-3"
    >
      <button
        onClick={() => window.location.href = "mailto:"}
        className="group w-full py-4 bg-[#0088b5] hover:bg-[#0077a1] text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
      >
        <Mail className="w-5 h-5" />
        Open Email App
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>

      <Link
        href="/media-partner/login"
        className="block w-full py-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all text-center"
      >
        Back to Login
      </Link>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.45 }}
      className="mt-10 space-y-4"
    >
      <p className="text-sm text-[#9A9EA7]">
        Wrong email?{" "}
        <button
          onClick={onBackToForm}
          className="text-[#0177AB] hover:text-[#006d91] font-semibold transition-colors"
        >
          Go back and correct it
        </button>
      </p>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-sm text-amber-800">
          <strong>Can&apos;t find it?</strong> Check your spam or junk folder. 
          The email was sent from <span className="font-mono">noreply@vaadmedia.com</span>
        </p>
      </div>
    </motion.div>
  </motion.div>
);

export default function SignUpPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registrationState, setRegistrationState] = useState<RegistrationState>("form");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const { signUp, isLoading } = useAuthContext();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      termsAndCondition: false,
      fullName: "",
      email: "",
      phoneNumber: "",
      businessName: "",
      state: "",
      city: "",
      country: "",
      password: "",
      confirmPassword: "",
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
        businessName: data.businessName,
        state: data.state,
        city: data.city,
        country: data.country,
        logo: data.logo || null,
      });

      setRegisteredEmail(data.email);
      setRegistrationState("success");
      
      showToast({
        type: "success",
        message: "Account created! Please check your email to verify.",
        duration: 5000,
      });
    } catch (error: any) {
      const apiMessage = error?.message || error?.data?.message || error?.response?.data?.message || "Registration failed. Please try again.";
      setSubmitError(apiMessage);
      showToast({
        type: "error",
        message: apiMessage,
        duration: 4000,
      });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue('logo', file, { shouldValidate: true, shouldDirty: true });

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProceed = async () => {
    const isValid = await trigger(["fullName", "email", "password", "confirmPassword"]);
    if (isValid) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const navigationLinks = [
    { name: "About VAAD Media", href: "/about", isNextLink: true },
    { name: "Features", href: "/features", isNextLink: false },
    { name: "Pricing", href: "/pricing", isNextLink: false },
    { name: "Blog", href: "/blog", isNextLink: false },
    { name: "Contact Us", href: "/contact", isNextLink: false },
  ] as const;

  const socialLinks = [
    { name: "Facebook", href: "https://facebook.com/vaadmedia", icon: "/icons/facebook-grey.svg", ariaLabel: "Follow us on Facebook" },
    { name: "Twitter", href: "https://twitter.com/vaadmedia", icon: "/icons/twitter-grey.svg", ariaLabel: "Follow us on Twitter" },
    { name: "LinkedIn", href: "https://linkedin.com/company/vaadmedia", icon: "/icons/linkedin-grey.svg", ariaLabel: "Follow us on LinkedIn" },
    { name: "Instagram", href: "https://instagram.com/vaadmedia", icon: "/icons/instagram-grey.svg", ariaLabel: "Follow us on Instagram" },
  ] as const;

  const linkStyles = {
    base: "text-xs text-[#9A9EA7] hover:text-gray-700 font-semibold transition-colors duration-200",
    social: "text-gray-400 hover:text-gray-600 transition-colors duration-200",
  };

  if (registrationState === "success") {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row bg-black">
        <div className="hidden lg:flex lg:w-1/2 relative bg-black text-white">
          <div className="absolute top-6 left-6">
            <Image src="/vaad.svg" alt="VAAD Media" width={84} height={84} />
          </div>
          <div className="w-full h-full flex items-center justify-center p-12">
            <div className="max-w-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Welcome to Our Media Partner Network</h2>
              <p className="text-base text-gray-300 mb-6">
                By joining our Billboard Media Partner network, you’re helping brands reach audiences in powerful, real-world locations.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-24 xl:px-32 py-8 lg:py-12 bg-white">
          <SuccessView 
            registeredEmail={registeredEmail} 
            onBackToForm={() => setRegistrationState("form")} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-black">
      {/* Left Side - Info & Testimonial */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black text-white">
        <div className="absolute top-6 left-6">
          <Image src="/vaad.svg" alt="VAAD Media" width={84} height={84} />
        </div>
        <div className="w-full h-full flex items-center justify-center p-12">
          <div className="max-w-lg">
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to Our Media Partner Network</h2>
            <p className="text-base text-gray-300 mb-6">
              By joining our Billboard Media Partner network, you’re helping brands reach audiences in powerful, real-world locations. We look forward to building a successful and long-lasting partnership with you.
            </p>
            <div className="bg-neutral-900 rounded-2xl shadow-md p-6">
              <p className="text-sm text-gray-100 italic mb-4">“This partnership has transformed how we manage and monetize our billboard assets.”</p>
              <p className="text-sm text-gray-300 mb-4">When we joined the platform as a Billboard Media Partner, our biggest challenge was visibility and coordination.</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">AY</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-100">Amina Yusuf</div>
                  <div className="text-xs text-gray-300">Operations Manager, Lagos Billboards</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between items-center px-6 sm:px-12 lg:px-24 xl:px-32 py-8 lg:py-12 bg-white">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 lg:mb-0"
        >
          <Image src="/vaad.svg" alt="VAAD Media" width={120} height={120} />
        </motion.div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full lg:mx-0">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="text-sm text-[#9A9EA7]">Step</div>
              <div className="px-3 py-1 bg-[#E6F6FB] text-[#0177AB] rounded-full text-sm font-semibold">{step} of 2</div>
            </div>
            <h1 className="sm:text-2xl text-[6vw] font-bold text-[#0D0A19] mb-2 mt-2">
              {step === 1 ? "Get Started with VAAD Media" : "Complete Your Profile"}
            </h1>
            <p className="sm:text-sm text-[3.5vw] text-[#9A9EA7] font-medium">
              {step === 1 
                ? "Create an account to start booking billboards." 
                : "Tell us more about your business."}
            </p>
          </div>

          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {step === 1 ? (
              <>
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Enter your fullname"
                  error={errors.fullName?.message}
                  disabled={isSubmitting || isLoading}
                  {...register("fullName")}
                  autoComplete="off"
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  error={errors.email?.message}
                  disabled={isSubmitting || isLoading}
                  {...register("email")}
                  autoComplete="off"
                />

                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  error={errors.password?.message}
                  disabled={isSubmitting || isLoading}
                  {...register("password")}
                  autoComplete="new-password"
                />

                <div className="text-xs text-[#9A9EA7] mt-1 mb-2">
                  Password must be at least 8 characters, include an uppercase letter and a number.
                </div>

                <PasswordInput
                  label="Confirm Password"
                  placeholder="Re-type your password"
                  error={errors.confirmPassword?.message}
                  disabled={isSubmitting || isLoading}
                  {...register("confirmPassword")}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={handleProceed}
                  disabled={isSubmitting || isLoading}
                  className="w-full py-3 bg-[#0177AB] text-white rounded-xl font-semibold hover:bg-[#006d91] transition-colors"
                >
                  Continue
                </button>
              </>
            ) : (
              <>
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter your phone number"
                  error={errors.phoneNumber?.message}
                  disabled={isSubmitting || isLoading}
                  {...register("phoneNumber")}
                  autoComplete="off"
                />

                <Input
                  label="Business Name"
                  type="text"
                  placeholder="Enter your business name"
                  error={errors.businessName?.message}
                  disabled={isSubmitting || isLoading}
                  {...register("businessName")}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="State"
                    type="text"
                    placeholder="State"
                    error={errors.state?.message}
                    disabled={isSubmitting || isLoading}
                    {...register("state")}
                    autoComplete="off"
                  />

                  <Input
                    label="City"
                    type="text"
                    placeholder="City"
                    error={errors.city?.message}
                    disabled={isSubmitting || isLoading}
                    {...register("city")}
                    autoComplete="off"
                  />
                </div>

                <Input
                  label="Country"
                  type="text"
                  placeholder="Country"
                  error={errors.country?.message}
                  disabled={isSubmitting || isLoading}
                  {...register("country")}
                  autoComplete="off"
                />

                {/* Business Logo upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Business Logo (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleLogoChange}
                    className="sr-only"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="w-full h-28 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-3 cursor-pointer bg-white hover:bg-gray-50 transition-colors"
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="logo preview" className="max-h-24 object-contain" />
                    ) : (
                      <div className="text-sm text-slate-500 text-center">
                        Click to upload business logo
                        <br />
                        <span className="text-xs text-slate-400">(jpg, png, webp)</span>
                      </div>
                    )}
                  </label>
                </div>

                <TermsCheckbox
                  register={register}
                  error={errors.termsAndCondition?.message}
                />

                {submitError && (
                  <div className="text-sm text-[#E8505B] text-center bg-red-50 p-3 rounded-md">
                    {submitError}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting || isLoading}
                    className="flex items-center justify-center gap-2 py-3 px-6 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>

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
                </div>
              </>
            )}
          </form>

          <div className="mt-6 mb-12 text-center">
            <p className="sm:text-sm text-[3.5vw] text-[#9A9EA7] font-medium">
              Already have an account?{" "}
              <Link
                href="/media-partner/login"
                className="text-[#0177AB] hover:text-[#007a9e] font-semibold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 lg:mt-0 flex flex-col items-center">
          <nav className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
            {navigationLinks.map((link) => {
              const Component = link.isNextLink ? Link : "a";
              const href = link.isNextLink ? link.href : link.href;
              return (
                <Component
                  key={link.name}
                  href={href}
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
      </div>
    </div>
  );
}