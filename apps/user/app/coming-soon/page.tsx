"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Linkedin, Facebook, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const TARGET_DATE = new Date("2026-04-01T00:00:00");

function getTimeLeft() {
  const total = TARGET_DATE.getTime() - new Date().getTime();

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export default function ComingSoonPage() {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="relative w-full h-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#0177AB]" />

        {/* Floating circles */}
        <div className="absolute top-10 left-20 w-10 h-10 bg-white/10 rounded-full" />
        <div className="absolute top-32 right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute bottom-20 right-20 w-6 h-6 bg-white/10 rounded-full" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 -mt-20"
          >
            <Link href="/" className="flex items-center gap-2 mb-10">
              <Image
                src="/vaad-white-full.svg"
                alt="VAAD Media"
                width={60}
                height={32}
                className="w-auto"
                priority
              />
            </Link>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl md:text-[43.2px] font-semibold mb-2"
          >
            Coming Soon
          </motion.h1>

          <p className="text-sm opacity-80 mb-10 max-w-md">
            Get ready for the biggest marketing launch of the year
          </p>

          {/* Countdown */}
          <div className="flex items-center gap-6 md:gap-10 mb-10">
            {[
              { label: "Days", value: time.days },
              { label: "Hours", value: time.hours },
              { label: "Minutes", value: time.minutes },
              { label: "Seconds", value: time.seconds },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="text-center">
                  <motion.div
                    key={item.value}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-4xl md:text-6xl font-bold tracking-wider"
                  >
                    {String(item.value).padStart(2, "0")}
                  </motion.div>
                  <p className="text-xs mt-2 opacity-80">{item.label}</p>
                </div>

                {/* Separator */}
                {i < 3 && (
                  <span
                    className={`text-3xl md:text-4xl font-bold ${
                      i === 0
                        ? "text-yellow-400"
                        : i === 1
                          ? "text-red-400"
                          : "text-green-400"
                    }`}
                  >
                    :
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Socials */}
          <div className="flex gap-4">
            {[Linkedin, Facebook, Twitter].map((Icon, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#2b78a6] cursor-pointer hover:scale-110 transition"
              >
                <Icon size={16} />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Curve (SVG) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1440 200"
            className="w-full h-[180px]"
            preserveAspectRatio="none"
          >
            <path
              d="M0,100 C300,200 600,0 900,100 C1200,200 1440,100 1440,100 L1440,200 L0,200 Z"
              fill="#f2f2f2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
