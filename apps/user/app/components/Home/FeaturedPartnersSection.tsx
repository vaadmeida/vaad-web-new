"use client";

import Image from "next/image";

type Partner = {
  name: string;
  logo: string;
};

const partners: Partner[] = [
  { name: "Maggi Nigeria", logo: "/logos/partners/maggi.svg" },
  { name: "Cadbury Nigeria", logo: "/logos/partners/cardbury.svg" },
  { name: "CocaCola", logo: "/logos/partners/cola.svg" },
  { name: "Nestle Africa", logo: "/logos/partners/nestle.svg" },
  { name: "MTN Nigeria", logo: "/logos/partners/mtn.svg" },
  { name: "CWAY Beverage", logo: "/logos/partners/cway.svg" },
  { name: "Wakanow Bookings", logo: "/logos/partners/wakanow.svg" },
  { name: "Chivita Nigeria", logo: "/logos/partners/chivita.svg" },
  { name: "Kuda Bank", logo: "/logos/partners/kuda.svg" },
  { name: "GLO Global", logo: "/logos/partners/glo.svg" },
  { name: "Omo Detergent", logo: "/logos/partners/omo.svg" },
  { name: "Ribena Drink", logo: "/logos/partners/ribena.svg" },
  { name: "Opay Microfinance", logo: "/logos/partners/opay.svg" },
  { name: "Cowbell Milk", logo: "/logos/partners/cowbell.svg" },
];

export default function FeaturedPartnersSection() {
  return (
    <section className="bg-[#fff8f8] p-18">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-[35px] font-semibold text-[#0D0A19]">
            Featured Partners
          </h2>
          <p className="text-[#333333] mt-2 text-sm md:text-[17.93px] font-normal">
            Trusted by top brands in finance, FMCG, fashion, and telecom.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-y-10 gap-x-8 place-items-center">
          {partners.map((partner, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              
              {/* Logo Circle */}
              <div className="flex items-center justify-center">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={55}
                  height={55}
                  className="object-contain"
                />
              </div>

              {/* Label */}
              <p className="text-xs md:text-[11.63px] text-[#121127] mt-3 font-semibold">
                {partner.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
