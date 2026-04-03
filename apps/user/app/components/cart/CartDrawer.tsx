"use client";

import { Drawer, IconButton, Divider } from "@mui/material";
import Image from "next/image";
import { Trash2, Minus, Plus, Calendar, X, ChevronDown } from "lucide-react";

type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  anchor?: "left" | "right";
};

export default function CartDrawer({
  open,
  onClose,
  items,
  setItems,
  anchor = "right",
}: Props) {
  // ✅ Handlers
  const increase = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decrease = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      transitionDuration={{ enter: 220, exit: 180 }} // ⚡ fast + smooth
      ModalProps={{
        keepMounted: true,
        disablePortal: true, // ✅ fixes hydration
      }}
      PaperProps={{
        className: "w-[380px] md:w-[580px] bg-white ",
      }}
      BackdropProps={{
        className: "bg-black/30 backdrop-blur-sm", // Clean blur effect
      }}
    >
      <div className="flex flex-col h-full px-6 remove-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          {/* <h2 className="text-[24px] font-semibold text-[#101928">
            My Cart{" "}
            <span className="text-gray-500 text-sm">({items.length})</span>
          </h2> */}
          <div className="flex items-center gap-2">
            <span className="text-[24px] font-semibold text-[#101928]">
              My Cart
            </span>
            <div className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 bg-[#E8505B] rounded-full">
              <span className="text-white text-[14px] leading-none font-semibold">
                {items.length}
              </span>
            </div>
          </div>

          <IconButton onClick={onClose}>
            <X className="w-5 h-5" />
          </IconButton>
        </div>

        {/* <Divider /> */}

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5 remove-scrollbar">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              {/* Image */}
              <div className="relative w-[210px] h-[190px] rounded-[10px] overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 justify-between px-2 py-4">
                {/* Title + Price */}
                <div className="flex justify-between items-start gap-5">
                  <p className="text-[16px] font-medium text-[#101928] leading-tight">
                    {item.title}
                  </p>

                  <p className="text-[18px] font-semibold text-[#101928] leading-none whitespace-nowrap">
                    ₦{item.price.toLocaleString()}
                  </p>
                </div>

                {/* Quantity + Delete */}
                <div className="flex items-center justify-between mt-2">
                  {/* Stepper */}
                  <div className="flex items-center bg-[#F9FAFB] border border-[#F0F2F5] rounded-full px-3 py-1 gap-3">
                    <button
                      onClick={() => decrease(item.id)}
                      className="text-gray-500 hover:text-black"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="text-[16px] font-medium text-[#E8505B]">
                      {item.quantity}{" "}
                      <span className="text-[14px] font-light">
                        Month{item.quantity > 1 ? "s" : ""}
                      </span>
                    </span>

                    <button
                      onClick={() => increase(item.id)}
                      className="text-gray-500 hover:text-black"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => remove(item.id)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Duration Selector */}
                <button className="flex items-center justify-between border border-[#D0D5DD] rounded-md px-3 py-2 mt-2 text-sm text-[#344054] hover:bg-gray-50 transition">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Select date duration</span>
                  </div>

                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="py-6 space-y-3">
          <div className="w-full border border-[#F0F2F5]" />

          <div className="flex justify-between text-sm">
            <span className="text-[#667185] text-[16px] font-normal">
              Subtotal:
            </span>
            <span className="font-semibold text-[#101928] text-[18px]">
              ₦{subtotal.toLocaleString()}
            </span>
          </div>

          <div className="w-full border border-[#F0F2F5]" />

          <div className="flex gap-4 mt-5">
            <button className="flex-1 bg-[#0177AB] font-semibold text-[16px] text-white py-4 rounded-md hover:bg-[#0284c7] transition">
              Proceed to Pay
            </button>

            <button className="flex-1 border border-[#0177AB] py-2 rounded-md font-semibold text-[16px] text-[#0177AB] hover:bg-gray-100 transition">
              Continue Booking
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
