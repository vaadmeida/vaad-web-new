// app/contexts/cart-context.tsx
"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useCart } from "@/app/hooks/useCart";
import { CartItem, AddToCartRequest, UpdateCartItemRequest } from "../lib/cart/cart-service";

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  error: string | null;
  subtotal: number;
  totalItems: number;
  addToCart: (data: AddToCartRequest) => Promise<CartItem | null>;
  updateCartItem: (id: string, data: UpdateCartItemRequest) => Promise<CartItem | null>;
  removeFromCart: (id: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refetchCart: () => Promise<void>;
  isCartItemPending: (id: string) => boolean;
  isItemInCart: (billboardId: string) => boolean;
  getCartItemByBillboardId: (billboardId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCart();
  
  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}
