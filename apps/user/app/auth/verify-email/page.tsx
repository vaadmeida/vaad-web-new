// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Mail,
//   CheckCircle2,
//   XCircle,
//   Loader2,
//   ArrowRight,
//   Sparkles,
//   AlertCircle,
// } from "lucide-react";
// import Link from "next/link";
// import { useToast } from "@/app/contexts/toast-context";
// import { authService } from "@/app/lib/auth/auth-service";
// import { TokenService } from "@/app/lib/auth/token-service";
// import Image from "next/image";
// import { useAuthContext } from "@/app/contexts/auth-context";

// type VerificationStatus = "idle" | "verifying" | "success" | "error";

// interface VerificationData {
//   token: string | null;
//   email: string | null;
// }

// export default function VerifyEmailPage() {
//   const [status, setStatus] = useState<VerificationStatus>("idle");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [verificationData, setVerificationData] = useState<VerificationData>({
//     token: null,
//     email: null,
//   });
  
//   const { showToast } = useToast();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const hasAttemptedVerification = useRef(false);

//   // Decode the base64 data parameter
//   const decodeDataParam = useCallback((): VerificationData => {
//     const dataParam = searchParams.get("data");
    
//     if (!dataParam) {
//       console.warn("No verification data found in URL");
//       return { token: null, email: null };
//     }

//     try {
//       // Fix base64 padding and URL-safe characters
//       let base64 = dataParam
//         .replace(/-/g, "+")
//         .replace(/_/g, "/");
      
//       // Add padding if needed
//       while (base64.length % 4) {
//         base64 += "=";
//       }

//       const jsonString = atob(base64);
//       const parsed = JSON.parse(jsonString);
      
//       // Validate required fields
//       if (!parsed.token || !parsed.email) {
//         console.error("Missing required fields in verification data");
//         return { token: null, email: null };
//       }
      
//       return {
//         token: parsed.token,
//         email: parsed.email,
//       };
//     } catch (error) {
//       console.error("Failed to decode verification data:", error);
//       return { token: null, email: null };
//     }
//   }, [searchParams]);

//   // Extract token & email on mount
//   useEffect(() => {
//     const data = decodeDataParam();
//     setVerificationData(data);
//   }, [decodeDataParam]);

//   // Perform verification and auto-login
//   const performVerification = useCallback(async () => {
//     const { token, email } = verificationData;
    
//     if (!token || !email) {
//       setStatus("error");
//       setErrorMessage("Invalid verification link. Missing required information.");
//       return;
//     }

//     // Prevent multiple verification attempts
//     if (hasAttemptedVerification.current) return;
//     hasAttemptedVerification.current = true;

//     setStatus("verifying");

//     try {
//       // Generate tokens using the verification token and email
//       const tokens = await authService.generateTokens({ email, token });
      
//       // Store the tokens
//       TokenService.setTokens({
//         access: tokens.accessToken || tokens.access,
//         refresh: tokens.refreshToken || tokens.refresh,
//       });
//       TokenService.setUserEmail(email);
      
//       // Create a basic user profile
//       const userProfile = {
//         _id: tokens.userId || Date.now().toString(),
//         email,
//         fullName: email.split('@')[0],
//         phoneNumber: "",
//         status: "active",
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         deletedAt: null,
//       };
      
//       // Store user profile
//       localStorage.setItem("vaad_user", JSON.stringify(userProfile));
      
//       setStatus("success");
      
//       showToast({
//         type: "success",
//         message: "Email verified successfully! Welcome to VAAD Media.",
//         duration: 4000,
//       });
      
//       // IMPORTANT: Redirect to home page, NOT login page
//       setTimeout(() => {
//         router.push("/auth/login");
//       }, 1800);
      
//     } catch (error: any) {
//       console.error("Verification failed:", error);
      
//       setStatus("error");
//       const errorMsg = error?.message || "Verification failed. The link may have expired or is invalid.";
//       setErrorMessage(errorMsg);
      
//       showToast({
//         type: "error",
//         message: errorMsg,
//         duration: 5000,
//       });
//     }
//   }, [verificationData, router, showToast]);

//   // Auto-trigger verification when data is ready
//   useEffect(() => {
//     if (
//       verificationData.token && 
//       verificationData.email && 
//       status === "idle" && 
//       !hasAttemptedVerification.current
//     ) {
//       const timer = setTimeout(() => {
//         performVerification();
//       }, 500);
//       return () => clearTimeout(timer);
//     }
//   }, [verificationData, status, performVerification]);

//   // Loading state while decoding
//   if (status === "idle" && !verificationData.token && !verificationData.email) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-10 h-10 animate-spin text-[#0088b5] mx-auto mb-3" />
//           <p className="text-slate-500">Processing verification link...</p>
//         </div>
//       </div>
//     );
//   }

//   // Invalid link - no token or email
//   if (!verificationData.token || !verificationData.email) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//           className="w-full max-w-md"
//         >
//           <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-10 text-center border border-slate-100">
//             <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
//               <AlertCircle className="w-12 h-12 text-amber-500" />
//             </div>
//             <h1 className="text-2xl font-bold text-slate-900 mb-4">
//               Invalid Verification Link
//             </h1>
//             <p className="text-slate-600 mb-8 leading-relaxed">
//               This verification link is invalid or has expired.
//               <br />
//               Please sign up again to request a new verification email.
//             </p>
//             <Link
//               href="/auth/signup"
//               className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition-all"
//             >
//               Sign Up
//               <ArrowRight className="w-4 h-4" />
//             </Link>
//           </div>
//         </motion.div>
//       </div>
//     );
//   }

//   // Main verification UI
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
//       {/* Animated background blobs */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <motion.div
//           animate={{ 
//             x: [0, 100, -50, 0],
//             y: [0, -50, 100, 0],
//           }}
//           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//           className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"
//         />
//         <motion.div
//           animate={{ 
//             x: [0, -100, 50, 0],
//             y: [0, 50, -100, 0],
//           }}
//           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
//           className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl"
//         />
//       </div>

//       <motion.div
//         initial={{ opacity: 0, scale: 0.95, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
//         className="w-full max-w-md relative z-10"
//       >
//         {/* Logo */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="text-center mb-8"
//         >
//           <Image
//             src="/vaad.svg"
//             alt="VAAD Media"
//             width={120}
//             height={120}
//             className="mx-auto mb-4"
//             priority
//           />
//         </motion.div>

//         {/* Main Card */}
//         <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-white/50">
//           <AnimatePresence mode="wait">
//             {/* Idle State - Ready to Verify */}
//             {status === "idle" && (
//               <motion.div
//                 key="idle"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="text-center"
//               >
//                 <div className="w-20 h-20 bg-gradient-to-br from-[#0088b5]/10 to-[#0088b5]/5 rounded-full flex items-center justify-center mx-auto mb-6 relative">
//                   <Mail className="w-10 h-10 text-[#0088b5]" />
//                   <motion.div
//                     className="absolute inset-0 rounded-full border-2 border-[#0088b5]/20"
//                     animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
//                     transition={{ duration: 2, repeat: Infinity }}
//                   />
//                 </div>

//                 <h1 className="text-2xl font-bold text-slate-900 mb-3">
//                   Verify Your Email
//                 </h1>
//                 <p className="text-slate-500 mb-2">Click below to verify your email address</p>
//                 <p className="text-[#0088b5] font-medium mb-8 text-sm break-all px-4">
//                   {verificationData.email}
//                 </p>

//                 <button
//                   onClick={performVerification}
//                   className="group w-full py-4 bg-gradient-to-r from-[#0088b5] to-[#006d91] text-white rounded-xl font-semibold shadow-lg shadow-[#0088b5]/25 hover:shadow-[#0088b5]/40 transition-all duration-300 flex items-center justify-center gap-2"
//                 >
//                   Verify Email
//                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                 </button>
//               </motion.div>
//             )}

//             {/* Verifying State */}
//             {status === "verifying" && (
//               <motion.div
//                 key="verifying"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="text-center py-8"
//               >
//                 <div className="relative w-24 h-24 mx-auto mb-6">
//                   <motion.div className="absolute inset-0 rounded-full border-4 border-slate-100" />
//                   <motion.div
//                     className="absolute inset-0 rounded-full border-4 border-[#0088b5] border-t-transparent"
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
//                   />
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <Sparkles className="w-8 h-8 text-[#0088b5]" />
//                   </div>
//                 </div>
//                 <h2 className="text-xl font-bold text-slate-900 mb-2">
//                   Verifying your email...
//                 </h2>
//                 <p className="text-slate-500">Please wait a moment while we confirm your account</p>
//               </motion.div>
//             )}

//             {/* Success State */}
//             {status === "success" && (
//               <motion.div
//                 key="success"
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="text-center py-6"
//               >
//                 <motion.div
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
//                   className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
//                 >
//                   <CheckCircle2 className="w-11 h-11 text-green-600" />
//                 </motion.div>
//                 <h2 className="text-2xl font-bold text-slate-900 mb-3">
//                   Email Verified!
//                 </h2>
//                 <p className="text-slate-600 mb-6">
//                   Your email has been successfully verified.
//                   <br />
//                   Redirecting to your dashboard...
//                 </p>

//                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
//                   <motion.div
//                     className="h-full bg-gradient-to-r from-[#0088b5] to-emerald-500"
//                     initial={{ width: "0%" }}
//                     animate={{ width: "100%" }}
//                     transition={{ duration: 1.8, ease: "easeInOut" }}
//                   />
//                 </div>
//               </motion.div>
//             )}

//             {/* Error State */}
//             {status === "error" && (
//               <motion.div
//                 key="error"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center"
//               >
//                 <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <XCircle className="w-10 h-10 text-red-500" />
//                 </div>
//                 <h2 className="text-xl font-bold text-slate-900 mb-3">
//                   Verification Failed
//                 </h2>
//                 <p className="text-slate-500 mb-8 leading-relaxed">
//                   {errorMessage}
//                 </p>

//                 <div className="space-y-3">
//                   <button
//                     onClick={performVerification}
//                     className="w-full py-4 bg-[#0088b5] text-white rounded-xl font-semibold hover:bg-[#006d91] transition-colors flex items-center justify-center gap-2"
//                   >
//                     <Loader2 className="w-4 h-4" />
//                     Try Again
//                   </button>
//                   <Link
//                     href="/auth/signup"
//                     className="block w-full py-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
//                   >
//                     Back to Sign Up
//                   </Link>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Footer */}
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="text-center text-slate-400 text-sm mt-8"
//         >
//           Secured by VAAD Media
//         </motion.p>
//       </motion.div>
//     </div>
//   );
// }
import React from 'react'

export default function Veri() {
  return (
    <div>Veri</div>
  )
}
