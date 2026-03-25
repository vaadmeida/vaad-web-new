"use client";

import Image from "next/image";

export default function Testimonial() {
  return (
    <section className="bg-[#F9F9FB] p-18">
      <div className="max-w-3xl mx-auto text-center px-4">
        
        {/* Brand Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/logos/coca-cola-testimonial.svg"
            alt="CocaCola"
            width={80}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Quote */}
        <p className="text-[#121127] text-sm md:text-[19.92px] leading-relaxed max-w-2xl mx-auto font-normal">
          “Professional team, fast response, and premium billboard locations.
          Everything went smoothly from booking to display.”
        </p>

        {/* User */}
        <div className="flex items-center justify-center mt-6 gap-3">
          <Image
            src="/avatars/dummy-avatar.svg"
            alt="Daniel Okon"
            width={55}
            height={55}
            className="rounded-full object-cover"
          />
          <p className="text-[13.94px] font-semibold text-[#121127]">
            <span>
              Daniel Okon
            </span>{" "}
            , Brand Lead, Cocacola Nigeria
          </p>
        </div>
      </div>
    </section>
  );
}
