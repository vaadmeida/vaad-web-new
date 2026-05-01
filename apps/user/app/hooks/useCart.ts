/* eslint-disable @typescript-eslint/no-explicit-any */
// app/hooks/useCart.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/app/contexts/toast-context";
import { useAuthContext } from "@/app/contexts/auth-context";
import { CartItem, AddToCartRequest, UpdateCartItemRequest, cartService } from "../lib/cart/cart-service";

interface UseCartReturn {
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
  isItemInCart: (billboardId: string) => boolean;
  getCartItemByBillboardId: (billboardId: string) => CartItem | undefined;
}

export function useCart(): UseCartReturn {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subtotal, setSubtotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  const { isAuthenticated } = useAuthContext();
  const { showToast } = useToast();
  const isMountedRef = useRef(true);
  const initialFetchRef = useRef(false);

  const calculateTotals = useCallback((items: CartItem[]) => {
    const itemsCount = items.length;
    const subtotalAmount = items.reduce((sum, item) => {
      const rate = item.billboard?.rate || 0;
      return sum + (rate * item.durationInMonths);
    }, 0);
    
    setTotalItems(itemsCount);
    setSubtotal(subtotalAmount);
  }, []);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setTotalItems(0);
      setSubtotal(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const items = await cartService.getCart();
      
      if (!isMountedRef.current) return;
      
      setCartItems(items);
      calculateTotals(items);
    } catch (err: any) {
      console.error("Failed to fetch cart:", err);
      if (isMountedRef.current) {
        setError(err.message || "Failed to load cart");
        setCartItems([]);
        setTotalItems(0);
        setSubtotal(0);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, calculateTotals]);

  // Initial fetch
  useEffect(() => {
    isMountedRef.current = true;
    
    if (!initialFetchRef.current && isAuthenticated) {
      initialFetchRef.current = true;
      fetchCart();
    }
    
    return () => {
      isMountedRef.current = false;
    };
  }, [isAuthenticated, fetchCart]);

  const addToCart = useCallback(async (data: AddToCartRequest): Promise<CartItem | null> => {
    if (!isAuthenticated) {
      showToast?.({
        type: 'warning',
        message: 'Please login to add items to cart',
        duration: 3000,
      });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newItem = await cartService.addToCart(data);
      
      if (!isMountedRef.current) return null;
      
      // Refetch to get updated cart
      await fetchCart();
      
      showToast?.({
        type: 'success',
        message: 'Item added to cart successfully',
        duration: 3000,
      });
      
      return newItem;
    } catch (err: any) {
      console.error("Failed to add to cart:", err);
      const errorMsg = err.message || "Failed to add item to cart";
      setError(errorMsg);
      showToast?.({
        type: 'error',
        message: errorMsg,
        duration: 3000,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchCart, showToast]);

  const updateCartItem = useCallback(async (id: string, data: UpdateCartItemRequest): Promise<CartItem | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedItem = await cartService.updateCartItem(id, data);
      
      if (!isMountedRef.current) return null;
      
      // Calculate the updated items once
      const newItems = cartItems.map(item => 
        item._id === id ? { ...item, ...updatedItem } : item
      );
      
      // Update local state
      setCartItems(newItems);
      
      // Recalculate totals with the new items
      calculateTotals(newItems);
      
      showToast?.({
        type: 'success',
        message: 'Cart updated successfully',
        duration: 2000,
      });
      
      return updatedItem;
    } catch (err: any) {
      console.error("Failed to update cart item:", err);
      const errorMsg = err.message || "Failed to update cart item";
      setError(errorMsg);
      showToast?.({
        type: 'error',
        message: errorMsg,
        duration: 3000,
      });
      
      await fetchCart();
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [cartItems, calculateTotals, fetchCart, showToast]);

  const removeFromCart = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Store the current state for potential rollback
    const previousItems = [...cartItems];
    const updatedItems = cartItems.filter(item => item._id !== id);
    
    // Optimistic update
    setCartItems(updatedItems);
    calculateTotals(updatedItems);

    try {
      await cartService.removeFromCart(id);
      
      if (!isMountedRef.current) return false;
      
      showToast?.({
        type: 'success',
        message: 'Item removed from cart',
        duration: 2000,
      });
      
      return true;
    } catch (err: any) {
      console.error("Failed to remove from cart:", err);
      
      // Rollback - restore the previous state
      if (!isMountedRef.current) return false;
      
      setCartItems(previousItems);
      calculateTotals(previousItems);
      
      const errorMsg = err.message || "Failed to remove item from cart";
      setError(errorMsg);
      showToast?.({
        type: 'error',
        message: errorMsg,
        duration: 3000,
      });
      
      return false;
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [cartItems, calculateTotals, showToast]);

  const clearCart = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const previousItems = [...cartItems];
    setCartItems([]);
    setTotalItems(0);
    setSubtotal(0);

    try {
      await cartService.clearCart();
      
      showToast?.({
        type: 'success',
        message: 'Cart cleared successfully',
        duration: 2000,
      });
      
      return true;
    } catch (err: any) {
      console.error("Failed to clear cart:", err);
      
      setCartItems(previousItems);
      calculateTotals(previousItems);
      
      const errorMsg = err.message || "Failed to clear cart";
      setError(errorMsg);
      showToast?.({
        type: 'error',
        message: errorMsg,
        duration: 3000,
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [cartItems, calculateTotals, showToast]);

  const isItemInCart = useCallback((billboardId: string): boolean => {
    return cartItems.some(item => item.billboardId === billboardId);
  }, [cartItems]);

  const getCartItemByBillboardId = useCallback((billboardId: string): CartItem | undefined => {
    return cartItems.find(item => item.billboardId === billboardId);
  }, [cartItems]);

  return {
    cartItems,
    isLoading,
    error,
    subtotal,
    totalItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refetchCart: fetchCart,
    isItemInCart,
    getCartItemByBillboardId,
  };
}