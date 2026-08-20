"use client";

import { Drawer, IconButton } from "@mui/material";
import Image from "next/image";
import { Trash2, Minus, Plus, Calendar, X, ShoppingCart } from "lucide-react";
import { cartService } from "@/app/lib/cart/cart-service";
import { useCartContext } from "@/app/contexts/cart-context";
import { usePayment } from "@/app/hooks/usePayment";

type Props = {
  open: boolean;
  onClose: () => void;
  anchor?: "left" | "right";
};

const toYYYYMMDD = (value?: string) => {
  if (!value) return new Date().toISOString().slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
};

/** Resolve monthly rate from common cart payload shapes */
const getItemRate = (item: any): number => {
  const candidates = [
    item?.billboard?.rate,
    item?.billboard?.price,
    item?.rate,
    item?.price,
    item?.amount,
    item?.unitPrice,
    item?.monthlyRate,
    item?.cost,
    item?.billboardId?.rate,
    item?.billboardId?.price,
    item?.media?.rate,
    item?.media?.price,
  ];

  for (const value of candidates) {
    const n = Number(value);
    if (!Number.isNaN(n) && n > 0) return n;
  }
  return 0;
};

const getItemTotal = (item: any): number => {
  const months = Number(item?.durationInMonths) || 1;
  return getItemRate(item) * months;
};

export default function CartDrawer({ open, onClose, anchor = "right" }: Props) {
  const {
    cartItems,
    isLoading,
    error,
    totalItems,
    updateCartItem,
    removeFromCart,
    isCartItemPending,
  } = useCartContext();

  const { initializePayment, isPaying, error: paymentError, clearError } =
    usePayment();

  const hasItems = cartItems.length > 0;
  const isPayDisabled = isPaying || !hasItems;

  const computedSubtotal = cartItems.reduce(
    (sum, item) => sum + getItemTotal(item),
    0
  );

  const handleIncrease = async (itemId: string, currentDuration: number) => {
    if (isCartItemPending(itemId)) return;
    await updateCartItem(itemId, { durationInMonths: currentDuration + 1 });
  };

  const handleDecrease = async (itemId: string, currentDuration: number) => {
    if (currentDuration <= 1 || isCartItemPending(itemId)) return;
    await updateCartItem(itemId, { durationInMonths: currentDuration - 1 });
  };

  const handleRemove = async (itemId: string) => {
    if (isCartItemPending(itemId)) return;
    await removeFromCart(itemId);
  };

  const handleProceedToPay = async () => {
    if (isPayDisabled) return;
    clearError?.();

    const orderItems = cartItems
      .map((item) => ({
        durationInMonths: item.durationInMonths,
        billboardId: item.billboardId || item.billboard?._id || "",
        startDate: toYYYYMMDD(item.startDate),
      }))
      .filter((item) => Boolean(item.billboardId));

    if (!orderItems.length) return;
    await initializePayment({ orderItems });
  };

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      transitionDuration={{ enter: 220, exit: 180 }}
      ModalProps={{
        keepMounted: true,
        disablePortal: true,
      }}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 420, md: 520 },
          maxWidth: "100vw",
          bgcolor: "#fff",
        },
      }}
      BackdropProps={{
        className: "bg-black/30 backdrop-blur-sm",
      }}
    >
      <div className="flex flex-col h-full max-h-[100dvh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl sm:text-2xl font-semibold text-[#101928] truncate">
              My Cart
            </span>
            <div className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 bg-[#E8505B] rounded-full shrink-0">
              <span className="text-white text-sm leading-none font-semibold">
                {totalItems}
              </span>
            </div>
          </div>

          <IconButton onClick={onClose} size="small">
            <X className="w-5 h-5" />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6">
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700 break-words">{error}</p>
            </div>
          )}

          {paymentError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-800">Payment error</p>
              <p className="text-sm text-red-700 mt-1 break-words">
                {paymentError}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0177AB]" />
            </div>
          )}

          {!isLoading && cartItems.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-16 px-2">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart size={48} className="text-gray-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">
                Your cart is empty
              </h3>
              <p className="text-gray-500 text-center text-sm sm:text-base">
                Looks like you haven&apos;t added any items to your cart yet.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-[#0177AB] text-white rounded-lg hover:bg-[#006d91] transition"
              >
                Continue Shopping
              </button>
            </div>
          )}

          {!isLoading && cartItems.length > 0 && (
            <div className="py-5 space-y-4 sm:space-y-5">
              {/* TEMP: uncomment to inspect cart item shape on phone
              <pre className="text-[10px] bg-gray-100 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(cartItems[0], null, 2)}
              </pre>
              */}

              {cartItems.map((item) => {
                const isItemPending = isCartItemPending(item._id);
                const rate = getItemRate(item);
                const lineTotal = getItemTotal(item);
                const title =
                  item.billboard?.mediaType ||
                  "Billboard";
                const address =
                  item.billboard?.locationAddress ||
                  "";

                return (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-0 rounded-xl sm:rounded-none bg-gray-50 sm:bg-transparent border border-gray-100 sm:border-0"
                  >
                    <div className="relative w-full sm:w-[140px] md:w-[180px] h-[160px] sm:h-[140px] md:h-[160px] rounded-[10px] overflow-hidden shrink-0 bg-gray-100">
                      <Image
                        src={
                          item.billboard?.photos?.[0] ||
                          item.billboard?.images?.[0] ||
                          "/billboard-placeholder.jpg"
                        }
                        alt={title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="flex flex-col flex-1 min-w-0 justify-between gap-2">
                      <div className="flex justify-between items-start gap-3">
                        <p className="text-sm sm:text-base font-medium text-[#101928] leading-snug line-clamp-2 min-w-0">
                          {title}
                          {address ? ` at ${address}` : ""}
                        </p>
                        <p className="text-base sm:text-lg font-semibold text-[#101928] whitespace-nowrap shrink-0">
                          ₦{lineTotal.toLocaleString()}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-500">
                        ₦{rate.toLocaleString()} / month
                      </p>

                      {(item.billboard?.city || item.billboard?.state) && (
                        <p className="text-xs text-gray-400 truncate">
                          {[item.billboard?.city, item.billboard?.state]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}

                      <div className="flex items-center justify-between gap-2 mt-1">
                        <div className="flex items-center bg-[#F9FAFB] border border-[#F0F2F5] rounded-full px-2.5 sm:px-3 py-1 gap-2 sm:gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleDecrease(item._id, item.durationInMonths)
                            }
                            className="text-gray-500 hover:text-black transition disabled:opacity-50 p-1"
                            disabled={
                              item.durationInMonths <= 1 ||
                              isLoading ||
                              isItemPending
                            }
                          >
                            <Minus size={14} />
                          </button>

                          <span className="text-sm sm:text-base font-medium text-[#E8505B] whitespace-nowrap">
                            {item.durationInMonths}{" "}
                            <span className="text-xs sm:text-sm font-light">
                              Month{item.durationInMonths > 1 ? "s" : ""}
                            </span>
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleIncrease(item._id, item.durationInMonths)
                            }
                            className="text-gray-500 hover:text-black transition disabled:opacity-50 p-1"
                            disabled={isLoading || isItemPending}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item._id)}
                          className="text-gray-400 hover:text-red-500 transition disabled:opacity-50 p-2"
                          disabled={isLoading || isItemPending}
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={12} className="shrink-0" />
                        <span className="truncate">
                          Starts: {cartService.formatDate(item.startDate)}
                        </span>
                      </div>

                      {isItemPending && (
                        <p className="text-xs text-[#0177AB]">
                          Updating cart item...
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isLoading && cartItems.length > 0 && (
          <div className="shrink-0 border-t border-gray-100 px-4 sm:px-6 py-4 sm:py-6 space-y-3 bg-white">
            <div className="flex justify-between items-center gap-3">
              <span className="text-[#667185] text-sm sm:text-base">
                Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""}):
              </span>
              <span className="font-semibold text-[#101928] text-base sm:text-lg whitespace-nowrap">
                ₦{computedSubtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                type="button"
                onClick={handleProceedToPay}
                disabled={isPayDisabled}
                className={`w-full sm:flex-1 font-semibold text-sm sm:text-base py-3.5 sm:py-4 rounded-md transition ${
                  isPayDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#0177AB] text-white hover:bg-[#0284c7] cursor-pointer"
                }`}
              >
                {isPaying ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Proceed to Pay"
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={isPaying}
                className={`w-full sm:flex-1 border py-3.5 sm:py-4 rounded-md font-semibold text-sm sm:text-base transition ${
                  isPaying
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-[#0177AB] text-[#0177AB] hover:bg-gray-100"
                }`}
              >
                Continue Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}