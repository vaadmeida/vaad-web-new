"use client";

import Image from "next/image";
import bgImg from "@/public/images/ts1.jpg";

interface TestimonialHeroProps {
  quote: string;
  description: string;
  backgroundImage?: string;
  badge?: string;
}

const TestimonialHero = ({
  quote,
  description,
  backgroundImage,
  badge = "OUR MERCHANT ONCE SAID",
}: TestimonialHeroProps) => {
  return (
    <section className="relative w-full py-14 min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src={backgroundImage || bgImg}
        alt="testimonial background"
        fill
        className="object-cover"
        priority
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#0b1220]/80 z-0" />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-6">
        {/* Badge */}
        <span className="sm:text-[11.95px] text-[2.5vw] tracking-wide uppercase bg-black/30 text-white px-3 py-1 rounded-full font-medium">
          {badge}
        </span>

        {/* Quote */}
        <h2 className="mt-6 text-white text-[4.5vw] sm:text-[35.85px] font-semibold max-w-3xl leading-snug">
          “{quote}”
        </h2>

        {/* Description */}
        <p className="text-white sm:text-[15.93px] text-[3.5vw] mt-4 sm:max-w-2xl leading-relaxed">
          {description}
        </p>

        {/* User */}
        <div className="flex items-center justify-center mt-8 gap-3">
          <Image
            src="/avatars/dummy-avatar.svg"
            alt="Ngozi Henry"
            width={55}
            height={55}
            className="rounded-full object-cover"
          />
          <p className="sm:text-[16px] font-normal flex flex-col items-start text-white text-left">
            <span className="sm:text-[20px] font-semibold">
              Ngozi Henry
            </span>
            <span>Private Equity, FMCG</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialHero;