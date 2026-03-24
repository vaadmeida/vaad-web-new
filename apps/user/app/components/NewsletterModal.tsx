"use client";

import { useState } from "react";
import { X, Mail, Send, CheckCircle2, ArrowRight, LogOut } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useNewsletter } from "@/app/hooks/useNewsletter";

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "subscribe" | "unsubscribe";
}

export default function NewsletterModal({ isOpen, onClose, mode = "subscribe" }: NewsletterModalProps) {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { subscribe, unsubscribe, isLoading, error, isSuccess, reset } = useNewsletter();

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setEmail("");
      setSubmittedEmail("");
      reset();
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setSubmittedEmail(email);
    
    let success = false;
    if (mode === "subscribe") {
      success = await subscribe(email);
    } else {
      success = await unsubscribe(email);
    }
    
    if (success) {
      setEmail("");
    }
  };

  const handleReset = () => {
    setEmail("");
    setSubmittedEmail("");
    reset();
  };

  // Animation variants
  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring" as const,
        damping: 25,
        stiffness: 300,
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.2 } 
    },
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.1, duration: 0.3 } 
    },
  };

  const successVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring" as const,
        damping: 15,
        stiffness: 200
      }
    },
  };

  const isSubscribe = mode === "subscribe";
  const title = isSubscribe ? "Subscribe to Newsletter" : "Unsubscribe from Newsletter";
  const description = isSubscribe 
    ? "Get the latest updates, articles, and valuable materials delivered to your inbox."
    : "We're sad to see you go. Please confirm your email to unsubscribe.";
  const buttonText = isSubscribe ? "Subscribe" : "Unsubscribe";
  const successTitle = isSubscribe ? "Successfully Subscribed! 🎉" : "Successfully Unsubscribed";
  const successMessage = isSubscribe 
    ? `You've been subscribed to our newsletter at ${submittedEmail}. You'll start receiving updates soon!`
    : `You've been unsubscribed from our newsletter at ${submittedEmail}. We hope to see you again!`;
  const iconColor = isSubscribe ? "from-[#0177AB] to-[#6068DB]" : "from-red-500 to-orange-500";
  const buttonGradient = isSubscribe 
    ? "from-[#0177AB] to-[#6068DB]" 
    : "from-red-500 to-orange-500";

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            onClick={handleClose}
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0177AB] via-[#6068DB] to-[#0177AB] rounded-2xl blur-xl opacity-30" />
              
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0177AB] via-[#6068DB] to-[#0177AB]" />

                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-all duration-300 z-10 group"
                >
                  <X size={18} className="text-gray-500 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="p-8"
                >
                  {!isSuccess ? (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className={`w-16 h-16 bg-gradient-to-br ${iconColor}/10 rounded-2xl flex items-center justify-center mx-auto mb-6`}
                      >
                        {isSubscribe ? (
                          <Mail className="w-8 h-8 text-[#0177AB]" />
                        ) : (
                          <LogOut className="w-8 h-8 text-red-500" />
                        )}
                      </motion.div>

                      <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                        {title}
                      </h2>
                      <p className="text-center text-gray-500 text-sm mb-8">
                        {description}
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                          <motion.div
                            animate={{
                              scale: isFocused ? 1.02 : 1,
                              y: isFocused ? -2 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder="Enter your email address"
                                className="w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#0177AB] transition-all duration-300"
                                required
                              />
                              <motion.div
                                initial={false}
                                animate={{
                                  scaleX: isFocused ? 1 : 0,
                                }}
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0177AB] to-[#6068DB] origin-left"
                              />
                            </div>
                          </motion.div>
                        </div>

                        <AnimatePresence>
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="p-3 bg-red-50 border border-red-200 rounded-xl"
                            >
                              <p className="text-red-600 text-sm text-center">{error}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="flex gap-3 pt-4">
                          <motion.button
                            type="button"
                            onClick={handleClose}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300"
                          >
                            Cancel
                          </motion.button>
                          
                          <motion.button
                            type="submit"
                            disabled={isLoading || !email}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex-1 px-6 py-3 bg-gradient-to-r ${buttonGradient} text-white font-medium rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group`}
                          >
                            {isLoading ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Processing...</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                                <span>{buttonText}</span>
                                {isSubscribe ? (
                                  <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                                ) : (
                                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                )}
                              </div>
                            )}
                          </motion.button>
                        </div>

                        <p className="text-xs text-gray-400 text-center">
                          We respect your privacy. No spam, ever.
                        </p>
                      </form>
                    </>
                  ) : (
                    <motion.div
                      variants={successVariants}
                      initial="hidden"
                      animate="visible"
                      className="text-center py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.1 }}
                        className={`w-20 h-20 bg-gradient-to-br ${isSubscribe ? "from-green-400 to-green-500" : "from-orange-400 to-red-500"} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
                      >
                        <CheckCircle2 className="w-10 h-10 text-white" />
                      </motion.div>

                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold text-gray-900 mb-2"
                      >
                        {successTitle}
                      </motion.h3>
                      
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-600 mb-6"
                      >
                        {successMessage}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gray-50 rounded-xl p-4 mb-6"
                      >
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-[#0177AB]" />
                          <div className="text-left">
                            <p className="text-xs text-gray-500">Email confirmed</p>
                            <p className="text-sm font-medium text-gray-900">{submittedEmail}</p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.button
                        onClick={handleReset}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0177AB] to-[#6068DB] text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 group"
                      >
                        <span>Close</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}