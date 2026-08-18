"use client";

import { useState } from "react";
import { Drawer, IconButton } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, Calendar, X, ShoppingCart } from "lucide-react";
import { cartService } from "@/app/lib/cart/cart-service";
import { useCartContext } from "@/app/contexts/cart-context";
import { useToast } from "@/app/contexts/toast-context";
import { paymentService } from "@/app/lib/payment/payment-service";
import ApiErrorDisplay from "@/app/components/debug/ApiErrorDisplay";

type Props = {
  open: boolean;
  onClose: () => void;
  anchor?: "left" | "right";
  
};

export default function CartDrawer({ open, onClose, anchor = "right" }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { 
    cartItems, 
    isLoading, 
    error,
    errorDetails,
    subtotal, 
    totalItems,
    updateCartItem,
    removeFromCart,
    isCartItemPending,
  } = useCartContext();

  // Handle quantity increase
  const handleIncrease = async (itemId: string, currentDuration: number) => {
    if (isCartItemPending(itemId)) return;

    const newDuration = currentDuration + 1;
    await updateCartItem(itemId, { durationInMonths: newDuration });
  };

  // Handle quantity decrease
  const handleDecrease = async (itemId: string, currentDuration: number) => {
    if (currentDuration <= 1 || isCartItemPending(itemId)) return;

    const newDuration = currentDuration - 1;
    await updateCartItem(itemId, { durationInMonths: newDuration });
  };

  // Handle remove item
  const handleRemove = async (itemId: string) => {
    if (isCartItemPending(itemId)) return;

    const success = await removeFromCart(itemId);
    if (!success) {
      console.error("Failed to remove item from cart");
    }
  };

  // Calculate item total price
  const getItemTotal = (item: (typeof cartItems)[number]) => {
    const rate = item.billboard?.rate || 0;
    return rate * item.durationInMonths;
  };

  const handleCheckout = async () => {
    if (!cartItems.length || isCheckingOut) {
      return;
    }

    setIsCheckingOut(true);

    try {
      const orderItems = cartItems.map((item) => ({
        billboardId: item.billboardId,
        durationInMonths: item.durationInMonths,
        startDate: new Date(item.startDate).toISOString().split("T")[0],
      }));

      const payment = await paymentService.initializePayment({ orderItems });
      const gatewayName = (payment.gateway || payment.provider || "unknown").toLowerCase();

      if (payment.redirectUrl) {
        window.location.href = payment.redirectUrl;
        return;
      }

      if (gatewayName.includes("paystack")) {
        const paystackKey = payment.key || payment.data?.key || payment.data?.publicKey || payment.data?.paystackKey;

        if (!paystackKey || typeof paystackKey !== "string") {
          throw new Error("Paystack public key is missing in the payment initialization response.");
        }

        await paymentService.openPaystackCheckout({
          key: paystackKey,
          email: payment.email,
          amount: payment.amount || subtotal,
          reference: payment.reference,
          currency: payment.currency || "NGN",
          callback: () => {
            const reference = payment.reference ? `&reference=${encodeURIComponent(payment.reference)}` : "";
            router.push(`/payment/success?gateway=paystack${reference}`);
          },
          onClose: () => {
            const reference = payment.reference ? `&reference=${encodeURIComponent(payment.reference)}` : "";
            router.push(`/payment/error?message=${encodeURIComponent("Payment was cancelled before completion.")}${reference}`);
          },
        });

        return;
      }

      throw new Error(payment.message || "No supported payment gateway was returned by the backend.");
    } catch (error: any) {
      console.error("Checkout initialization failed:", error);
      const message = error?.message || "Unable to initialize payment. Please try again.";
      showToast({
        type: "error",
        title: "Payment failed",
        message,
        duration: 5000,
      });
      const encodedMessage = encodeURIComponent(message);
      router.push(`/payment/error?message=${encodedMessage}`);
    } finally {
      setIsCheckingOut(false);
    }
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
        className: "w-[380px] md:w-[580px] bg-white",
      }}
      BackdropProps={{
        className: "bg-black/30 backdrop-blur-sm",
      }}
    >
      <div className="flex flex-col h-full px-6 remove-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="text-[24px] font-semibold text-[#101928]">
              My Cart
            </span>
            <div className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 bg-[#E8505B] rounded-full">
              <span className="text-white text-[14px] leading-none font-semibold">
                {totalItems}
              </span>
            </div>
          </div>

          <IconButton onClick={onClose}>
            <X className="w-5 h-5" />
          </IconButton>
        </div>

        {/* Development Error Display */}
        {error && errorDetails && (
          <ApiErrorDisplay
            title="Cart Operation Failed"
            error={error}
            endpoint={errorDetails.endpoint}
            payload={errorDetails.payload}
            response={errorDetails.response}
          />
        )}

        {error && !errorDetails && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0177AB]"></div>
          </div>
        )}

        {/* Empty Cart State */}
        {!isLoading && cartItems.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingCart size={64} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Your cart is empty</h3>
            <p className="text-gray-500 text-center">
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

        {/* Items List */}
        {!isLoading && cartItems.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto py-5 space-y-5 remove-scrollbar">
              {cartItems.map((item) => {
                const isItemPending = isCartItemPending(item._id);

                return (
                  <div key={item._id} className="flex gap-3">
                  {/* Image */}
                  <div className="relative w-[210px] h-[190px] rounded-[10px] overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image
                      src={item.billboard?.photos?.[0] || item.billboard?.images?.[0] || "/billboard-placeholder.jpg"}
                      alt={item.billboard?.mediaType || "Billboard"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 justify-between px-2 py-4">
                    {/* Title + Price */}
                    <div className="flex justify-between items-start gap-5">
                      <p className="text-[16px] font-medium text-[#101928] leading-tight line-clamp-2">
                        {item.billboard?.mediaType} at {item.billboard?.locationAddress}
                      </p>

                      <p className="text-[18px] font-semibold text-[#101928] leading-none whitespace-nowrap">
                        ₦{getItemTotal(item).toLocaleString()}
                      </p>
                    </div>

                    {/* Price per month */}
                    <p className="text-sm text-gray-500">
                      ₦{item.billboard?.rate?.toLocaleString()} / month
                    </p>

                    {/* Location */}
                    <p className="text-xs text-gray-400 mt-1">
                      {item.billboard?.locationAddress}, {item.billboard?.city}, {item.billboard?.state}
                    </p>

                    {/* Quantity + Delete */}
                    <div className="flex items-center justify-between mt-3">
                      {/* Stepper */}
                      <div className="flex items-center bg-[#F9FAFB] border border-[#F0F2F5] rounded-full px-3 py-1 gap-3">
                        <button
                          type="button"
                          onClick={() => handleDecrease(item._id, item.durationInMonths)}
                          className="text-gray-500 hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={item.durationInMonths <= 1 || isLoading || isItemPending}
                        >
                          <Minus size={14} />
                        </button>

                        <span className="text-[16px] font-medium text-[#E8505B]">
                          {item.durationInMonths}{" "}
                          <span className="text-[14px] font-light">
                            Month{item.durationInMonths > 1 ? "s" : ""}
                          </span>
                        </span>

                        <button
                          type="button"
                          onClick={() => handleIncrease(item._id, item.durationInMonths)}
                          className="text-gray-500 hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isLoading || isItemPending}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleRemove(item._id)}
                        className="text-gray-400 hover:text-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading || isItemPending}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Start Date Display */}
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>Starts: {cartService.formatDate(item.startDate)}</span>
                    </div>

                    {isItemPending && (
                      <p className="mt-2 text-xs text-[#0177AB]">Updating cart item...</p>
                    )}
                  </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="py-6 space-y-3">
              <div className="w-full border border-[#F0F2F5]" />

              <div className="flex justify-between text-sm">
                <span className="text-[#667185] text-[16px] font-normal">
                  Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''}):
                </span>
                <span className="font-semibold text-[#101928] text-[18px]">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="w-full border border-[#F0F2F5]" />

              <div className="flex gap-4 mt-5">
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || isLoading}
                  className="flex-1 bg-[#0177AB] font-semibold text-[16px] text-white py-4 rounded-md hover:bg-[#0284c7] transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isCheckingOut ? "Initializing payment..." : "Proceed to Pay"}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-[#0177AB] py-2 rounded-md font-semibold text-[16px] text-[#0177AB] hover:bg-gray-100 transition"
                >
                  Continue Booking
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
