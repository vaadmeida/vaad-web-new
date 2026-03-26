"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { footerSections, footerBottomLinks } from "@/app/config/footer.config";
import Image from "next/image";
import NewsletterModal from "../NewsletterModal";

/* =========================
   ANIMATION VARIANTS
========================= */
const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [email, setEmail] = useState("");
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [newsletterMode, setNewsletterMode] = useState<"subscribe" | "unsubscribe">("subscribe");

  const handleSubscribeClick = () => {
    if (email) {
      setNewsletterMode("subscribe");
      setIsNewsletterModalOpen(true);
    }
  };

  const handleUnsubscribeClick = () => {
    setNewsletterMode("unsubscribe");
    setIsNewsletterModalOpen(true);
  };

  return (
    <>
      <footer className="bg-linear-to-r from-white to-[#F6F6F630] sm:px-18 pt-18 px-5 pb-14">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="sm:max-w-6xl mx-auto sm:px-4"
        >
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-16">
            {/* LEFT */}
            <motion.div variants={fadeUp}>
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 mb-10">
                <Image
                  src="/vaad.svg"
                  alt="VAAD Media"
                  width={60}
                  height={32}
                  className="w-auto"
                  priority
                />
              </Link>

              {isHome ? (
                <div className="flex items-center gap-4 text-gray-500">
                  {[
                    {
                      name: "facebook",
                      icon: "/icons/facebook-grey.svg",
                      alt: "Facebook",
                    },
                    {
                      name: "twitter",
                      icon: "/icons/twitter-grey.svg",
                      alt: "Twitter",
                    },
                    {
                      name: "linkedin",
                      icon: "/icons/linkedin-grey.svg",
                      alt: "LinkedIn",
                    },
                    {
                      name: "instagram",
                      icon: "/icons/instagram-grey.svg",
                      alt: "Instagram",
                    },
                    {
                      name: "tiktok",
                      icon: "/icons/tiktok-grey.svg",
                      alt: "TikTok",
                    },
                  ].map((social, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={social.icon}
                        alt={social.alt}
                        className="w-6.5 h-6.5 hover:text-gray-800 cursor-pointer transition"
                        style={{
                          filter:
                            "brightness(0) saturate(100%) invert(45%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(88%)",
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <>
                  <p className="text-[16px] font-normal text-[#344054] mb-6 max-w-xs">
                    Be the first to receive all the recent updates, articles, and
                    valuable materials.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border border-[#D0D5DD] rounded-md p-4 text-sm w-full max-w-50 focus:outline-none focus:ring-2 focus:ring-[#2A7AB0] transition"
                    />
                    <motion.button
                      onClick={handleSubscribeClick}
                      whileTap={{ scale: 0.96 }}
                      whileHover={{ scale: 1.03 }}
                      className="bg-[#0177AB] hover:bg-[#256a96] text-white p-4 rounded-md text-[16px] font-semibold transition"
                    >
                      Subscribe
                    </motion.button>
                  </div>
                  <button
                    onClick={handleUnsubscribeClick}
                    className="text-xs text-gray-500 hover:text-[#0177AB] mt-3 transition-colors"
                  >
                    Unsubscribe
                  </button>
                </>
              )}
            </motion.div>

            {/* DYNAMIC SECTIONS */}
            {footerSections.map((section) => (
              <motion.div key={section.title} variants={fadeUp}>
                <h4 className="text-[15.93px] text-[#98A2B3] font-normal mb-4">
                  {section.title}
                </h4>

                <ul className="space-y-2 text-sm text-[#667185]">
                  {section.links.map((link) => (
                    <motion.li
                      key={link.label}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={link.href || "#"}
                        className="flex items-center gap-2 hover:text-gray-800 transition"
                      >
                        {link.label}

                        {link.badge && (
                          <span className="text-[13.94px] font-medium bg-blue-100 text-[#0177AB] px-[11.95px] py-[2px] rounded-full">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <motion.div variants={fadeUp} className="border-t border-gray-200" />

          {/* Bottom */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col md:flex-row items-center justify-between py-6 text-[14px] font-medium text-[#667185] gap-4"
          >
            <div className="flex items-center gap-6 flex-wrap">
              {footerBottomLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href || "#"}
                  className="hover:text-gray-800 transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <p className="text-[#98A2B3]">© 2023 Rayna. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </footer>

      {/* Newsletter Modal */}
      <NewsletterModal
        isOpen={isNewsletterModalOpen}
        onClose={() => setIsNewsletterModalOpen(false)}
        mode={newsletterMode}
      />
    </>
  );
}