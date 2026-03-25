import React from "react";

export default function Map() {
  return (
    <div className="h-123.75">
      <div className="w-full h-full overflow-hidden relative group">
        {/* Overlay for premium feel */}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition duration-500 z-10 pointer-events-none" />

        {/* Google Map */}
        <iframe
          src="https://www.google.com/maps?q=1B%20Awayewaserere%20St%2C%20Ogba%2C%20Ikeja%2C%20Lagos&z=15&output=embed"
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Floating Location Card */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-lg shadow-md border border-gray-200 z-20 max-w-[260px]">
          <p className="text-[12px] font-semibold text-gray-900 mb-1">
            Our Office
          </p>
          <p className="text-[11.5px] text-gray-600 leading-relaxed">
            1B Awayewaserere St, off Lateef Jakande Road,
            <br />
            Ogba, Ikeja 100212, Lagos
          </p>
        </div>
      </div>
    </div>
  );
}
