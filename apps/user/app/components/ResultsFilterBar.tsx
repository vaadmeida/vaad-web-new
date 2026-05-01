/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const CartDrawer = dynamic(() => import("./cart/CartDrawer"), { ssr: false });

type Props = {
  title?: string;
  total: number;
  filters: string[];
  activeFilter: string;
  onFilterChange: (value: string) => void;
  openCart: any;
  open: boolean;
  closeCart: any;
};

export default function ResultsFilterBar({
  title = "Static Billboard",
  total,
  filters,
  activeFilter,
  onFilterChange,
  openCart,
  open,
  closeCart,
}: Props) {
  const mockCartItems = [
    {
      id: "1",
      title: "LED Billboard at Roundabout",
      location: "Lekki Phase 1, Lagos",
      price: 720000,
      duration: 1,
      availableInDays: 3,
      image: "/images/hd-1.jpg",
    },
    {
      id: "2",
      title: "Unipole Billboard at Toll Plaza",
      location: "Lekki-Epe Expressway, Lagos",
      price: 300000,
      duration: 1,
      availableInDays: 7,
      image:
        "https://images.squarespace-cdn.com/content/v1/5dee6587e159e73b7ff7d7cc/2cc7e6ae-6fdc-4b57-aa8e-18523b839ff0/Example+of+an+Effective+Billboard+Design",
    },
    {
      id: "3",
      title: "Gantry Billboard at Expressway",
      location: "Third Mainland Bridge, Lagos",
      price: 1500000,
      duration: 1,
      availableInDays: 5,
      image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231",
    },
  ];
  // ✅ turn mock data into state
  const [items, setItems] = useState(
    mockCartItems.map((item) => ({
      ...item,
      quantity: 1, // required
    })),
  );

  return (
    <div className="flex items-end justify-between mb-6">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Title */}
        <h2 className="text-[16px] font-semibold text-gray-800">
          {title} :{" "}
          <span className="font-normal text-gray-600">
            {total} search results found
          </span>
        </h2>

        {/* Filter Chips */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          {filters.map((filter, index) => {
            const isActive = filter === activeFilter;

            return (
              <button
                key={index}
                onClick={() => onFilterChange(filter)}
                className={`px-4 py-2 text-sm whitespace-nowrap transition ${
                  isActive
                    ? "bg-[#e6f6fb] text-[#0088b5] font-medium"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                } ${
                  index !== filters.length - 1 ? "border-r border-gray-300" : ""
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative">
        <button
          onClick={openCart}
          className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-white text-sm hover:bg-gray-50 transition whitespace-nowrap"
        >
          <span>My Cart</span>
          <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
        </button>

        {/* Drawer */}
        <CartDrawer
          open={open}
          onClose={closeCart}
        />
      </div>
    </div>
  );
}
