/* eslint-disable @typescript-eslint/no-explicit-any */
// apps/web/app/verify-email/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuthContext } from "@/app/contexts/auth-context";
import { useToast } from "@/app/contexts/toast-context";
import Button from "@/app/components/Button";
import { authService } from "@/app/lib/auth/auth-service";
import { cookieService } from "@/app/lib/cookies/cookie-service";

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false);
//   const { generateTokens } = useAuthContext(); // You might need to expose this
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token && email && !isVerifying) {
      handleVerification();
    }
  }, [token, email]);

  const handleVerification = async () => {
    setIsVerifying(true);
    try {
      // Exchange token for auth tokens (server will set HttpOnly cookies)
      await authService.generateTokens({ email: email!, token: token! });
      // Retrieve current user and persist in cookie (authService handles cookie write)
      try {
        await authService.getCurrentUser();
      } catch {}
      
      showToast({
        type: 'success',
        message: 'Email verified successfully! You are now logged in.',
        duration: 5000,
      });
      
      router.push('/dashboard');
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.message || 'Email verification failed. Please try again.',
        duration: 4000,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <Image src="/vaad.svg" alt="VAAD Media" width={120} height={120} className="mb-8" />
      
      <h1 className="text-2xl font-bold text-[#0D0A19] mb-4">Verify Your Email</h1>
      <p className="text-[#9A9EA7] text-center mb-6">
        Click the button below to verify your email and complete your registration.
      </p>
      
      {isVerifying ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0088b5]" />
        </div>
      ) : (
        <Button onClick={handleVerification} fullWidth>
          Verify Email & Continue
        </Button>
      )}
    </div>
  );
}