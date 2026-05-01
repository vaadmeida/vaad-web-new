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

    setError(null);

    try {
      const newItem = await cartService.addToCart(data);
      
      if (!isMountedRef.current) return null;
      
      // Optimistic update - immediately add to cart state for instant UI update
      const updatedItems = [...cartItems, newItem];
      setCartItems(updatedItems);
      calculateTotals(updatedItems);
      
      showToast?.({
        type: 'success',
        message: 'Item added to cart successfully',
        duration: 3000,
      });
      
      // Refetch in background to ensure consistency with server
      // Don't await this to keep the UI responsive
      fetchCart().catch(err => {
        console.error("Failed to refetch cart:", err);
        // If refetch fails, keep the optimistic update
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
    }
  }, [isAuthenticated, cartItems, calculateTotals, fetchCart, showToast]);

  const updateCartItem = useCallback(async (id: string, data: UpdateCartItemRequest): Promise<CartItem | null> => {
    setError(null);

    // Store previous state for rollback
    const previousItems = [...cartItems];
    const itemToUpdate = cartItems.find(item => item._id === id);
    
    if (!itemToUpdate) {
      setError("Item not found in cart");
      return null;
    }

    // Optimistic update - apply changes immediately
    const optimisticItem = { ...itemToUpdate, ...data };
    const optimisticItems = cartItems.map(item =>
      item._id === id ? optimisticItem : item
    );
    
    setCartItems(optimisticItems);
    calculateTotals(optimisticItems);

    try {
      const updatedItem = await cartService.updateCartItem(id, data);
      
      if (!isMountedRef.current) return null;
      
      // Merge the server response with our optimistic update
      const serverUpdatedItems = cartItems.map(item => 
        item._id === id ? { ...item, ...updatedItem } : item
      );
      
      setCartItems(serverUpdatedItems);
      calculateTotals(serverUpdatedItems);
      
      showToast?.({
        type: 'success',
        message: 'Cart updated successfully',
        duration: 2000,
      });
      
      return updatedItem;
    } catch (err: any) {
      console.error("Failed to update cart item:", err);
      
      // Rollback on error
      if (!isMountedRef.current) return null;
      
      setCartItems(previousItems);
      calculateTotals(previousItems);
      
      const errorMsg = err.message || "Failed to update cart item";
      setError(errorMsg);
      showToast?.({
        type: 'error',
        message: errorMsg,
        duration: 3000,
      });
      
      return null;
    }
  }, [cartItems, calculateTotals, showToast]);

  const removeFromCart = useCallback(async (id: string): Promise<boolean> => {
    setError(null);

    // Store the current state for potential rollback
    const previousItems = [...cartItems];
    const updatedItems = cartItems.filter(item => item._id !== id);
    
    // Optimistic update
    setCartItems(updatedItems);
    calculateTotals(updatedItems);

    try {
      await cartService.removeFromCart(id);
      
      if (!isMountedRef.current) {
        // Component unmounted, restore state to be safe
        setCartItems(previousItems);
        calculateTotals(previousItems);
        return false;
      }
      
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