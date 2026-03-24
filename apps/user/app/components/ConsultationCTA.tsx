"use client";

import { useState } from "react";
import ConsultationModal from "./ConsultationModal";

export default function ConsultationCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="bg-white p-18">
        <div className="mx-auto px-4">
          <div className="bg-gradient-to-r from-[#0177AB] to-[#003045] rounded-[15.93px] py-[55.77px] px-[47.8px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
            
            {/* Left */}
            <div className="text-white">
              <h3 className="text-lg md:text-[31.87px] font-bold mb-2">
                Book a free consultation
              </h3>
              <p className="text-[17.93px] font-normal text-[#F5F9FC]">
                Professional team, fast response, and premium billboard locations.
                Everything went smoothly from booking.
              </p>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-2 min-w-[450px]">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#6068DB] hover:bg-[#5a52e0] w-full text-white px-[31.87px] py-[13.94px] rounded-lg text-[15.93px] font-medium transition"
              >
                Proceed
              </button>

              <p className="text-[13.94px] text-white text-left md:text-right">
                We care about the protection of your data. read our{" "}
                <span className="underline cursor-pointer hover:text-white/80">
                  Privacy policy
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}