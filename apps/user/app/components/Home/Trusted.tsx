import React from "react";

export default function Trusted() {
  const images = [
    {
      img: "/images/maggi.svg",
      name: "Maggi",
    },
    {
      img: "/images/kuda.svg",
      name: "Kuda",
    },
    {
      img: "/images/cadbury.svg",
      name: "Cardbury",
    },
    {
      img: "/images/wakanow.svg",
      name: "Wakanow",
    },
    {
      img: "/images/cocacola.svg",
      name: "Cocacola",
    },
    {
      img: "/images/cowbell.svg",
      name: "Cowbell",
    },
    {
      img: "/images/mtn.svg",
      name: "Mtn",
    },
    {
      img: "/images/nestle.svg",
      name: "Nestle",
    },
    {
      img: "/images/omni.svg",
      name: "Omni",
    },
    {
      img: "/images/opay.svg",
      name: "Opay",
    },
  ];

  return (
    <div className="w-full bg-white sm:py-18 sm:px-18 px-5 py-18 flex flex-col justify-center items-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="md:text-[32px] text-[5.5vw] text-[#141212] font-semibold">
          They trust us, you too can!
        </h1>
        <p className="font-normal text-center md:px-0 px-7 md:text-[16px] text-[3.5vw] text-[#434141]">
          Trusted by top brands in finance, FMCG, fashion, and telecom.
        </p>
      </div>

      <div className="flex justify-between w-full items-center gap-10 mt-10 flex-wrap">
        {images.map((item, index) => (
          <img
            key={index}
            src={item.img}
            alt={item.name}
            className="md:h-10 h-9 object-contain"
          />
        ))}
      </div>
    </div>
  );
}