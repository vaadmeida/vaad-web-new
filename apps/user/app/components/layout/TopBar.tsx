"use client";

export default function TopBar() {
  return (
    <div className="w-full bg-[#232323] text-white sm:text-sm text-[2.5vw] sm:px-18 px-4 py-4 flex justify-between items-center">
      <div className="flex gap-1.5">
        <img src='/icons/phone-grey.svg' alt="" />
        <span className="sm:text-[12px] text-[2.5vw] font-medium">+1 2345 56768</span>
      </div>
      <div className="flex gap-6 sm:text-[12px] text-[2.5vw] font-medium">
        <span>+234 8098016152</span>
        <span>info@niasoln.com</span>
      </div>
    </div>
  );
}