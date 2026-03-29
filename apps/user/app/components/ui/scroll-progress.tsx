"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      if (totalHeight > 0) {
        const percent = Math.min(Math.max((scrollTop / totalHeight) * 100, 0), 100);
        setProgress(percent);
      }

      rafRef.current = null;
    };

    const handleScroll = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updateProgress);
      }
    };

    // Initial calculation
    updateProgress();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[9999] overflow-hidden pointer-events-none">
      <motion.div
        className="h-full bg-[#0177AB] origin-left"
        style={{ width: `${progress}%` }}
        initial={{ scaleX: 0 }}
        animate={{ 
          scaleX: progress / 100,
          width: `${progress}%` 
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 0.6,
          restDelta: 0.001,
        }}
      />
    </div>
  );
}