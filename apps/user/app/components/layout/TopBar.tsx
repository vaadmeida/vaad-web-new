"use client";

export default function TopBar() {
  return (
    <div className="w-full bg-[#232323] text-white text-sm px-18 py-4 flex justify-between items-center">
      <div className="flex gap-1.5">
        <img src='/icons/phone-grey.svg' alt="" />
        <span className="text-[12px] font-medium">+1 2345 56768</span>
      </div>
      <div className="flex gap-6 text-[12px] font-medium">
        <span>+234 8098016152</span>
        <span>info@niasoln.com</span>
      </div>
    </div>
  );
}