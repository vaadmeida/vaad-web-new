"use client";

import Image from "next/image";

interface TestimonialHeroProps {
  quote: string;
  description: string;
  backgroundImage: string;
  badge?: string;
}

const TestimonialHero = ({
  quote,
  description,
  backgroundImage,
  badge = "OUR MERCHANT ONCE SAID",
}: TestimonialHeroProps) => {
  return (
    <section className="relative w-full py-14 md:h-125 overflow-hidden">
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt="testimonial background"
        fill
        className="object-cover"
        priority
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#0b1220]/80" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        {/* Badge */}
        <span className="sm:text-[11.95px] text-[2.5vw] tracking-wide uppercase bg-white text-[#0177AB] px-3 py-1 rounded-full font-medium">
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

        {/* Buttons */}
        <div className="flex items-center gap-4 mt-8 flex-wrap justify-center">
          <button className="bg-[#0177AB] hover:bg-[#0f7ae5] text-white sm:text-[17.93px] text-[3vw] font-medium px-[31.87px] py-[13.94px] rounded-lg transition">
            Request a quote
          </button>

          <button className="border border-[#0177AB] text-[#0177AB] sm:text-[17.93px] text-[3vw] font-medium px-[31.87px] py-[13.94px] rounded-lg hover:bg-[#1d8cf8]/10 transition">
            Partner with us
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialHero;
