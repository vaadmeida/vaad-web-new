/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/app/contexts/toast-context";
import { useAuthContext } from "@/app/contexts/auth-context";
import {
  CartItem,
  AddToCartRequest,
  UpdateCartItemPayload,
  UpdateCartItemRequest,
  cartService,
} from "../lib/cart/cart-service";

interface UseCartReturn {
  cartItems: CartItem[];
  isLoading: boolean;
  error: string | null;
  subtotal: number;
  totalItems: number;
  addToCart: (data: AddToCartRequest) => Promise<CartItem | null>;
  updateCartItem: (
    id: string,
    data: UpdateCartItemRequest
  ) => Promise<CartItem | null>;
  removeFromCart: (id: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refetchCart: () => Promise<void>;
  isCartItemPending: (id: string) => boolean;
  isItemInCart: (billboardId: string) => boolean;
  getCartItemByBillboardId: (billboardId: string) => CartItem | undefined;
}

interface LoadCartOptions {
  showLoader?: boolean;
  resetOnFailure?: boolean;
}

export function useCart(): UseCartReturn {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subtotal, setSubtotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pendingItemIds, setPendingItemIds] = useState<string[]>([]);

  const { isAuthenticated } = useAuthContext();
  const { showToast } = useToast();
  const isMountedRef = useRef(true);
  const cartItemsRef = useRef<CartItem[]>([]);

  const getItemRate = useCallback((item: CartItem) => {
    const rate =
      item.billboard?.rate ??
      (item as any).rate ??
      0;
    return Number(rate) || 0;
  }, []);

  const calculateTotals = useCallback(
    (items: CartItem[]) => {
      const itemsCount = items.length;
      const subtotalAmount = items.reduce((sum, item) => {
        return sum + getItemRate(item) * (item.durationInMonths || 1);
      }, 0);

      setTotalItems(itemsCount);
      setSubtotal(subtotalAmount);
    },
    [getItemRate]
  );

  const syncCartState = useCallback(
    (items: CartItem[]) => {
      cartItemsRef.current = items;
      setCartItems(items);
      calculateTotals(items);
    },
    [calculateTotals]
  );

  const setItemPendingState = useCallback((id: string, isPending: boolean) => {
    setPendingItemIds((current) => {
      if (isPending) {
        return current.includes(id) ? current : [...current, id];
      }
      return current.filter((itemId) => itemId !== id);
    });
  }, []);

  const getCartItemBillboardId = useCallback((item: CartItem): string => {
    return item.billboardId || item.billboard?._id || "";
  }, []);

  const upsertCartItem = useCallback(
    (items: CartItem[], incomingItem: CartItem) => {
      const incomingBillboardId = getCartItemBillboardId(incomingItem);
      const existingIndex = items.findIndex(
        (item) =>
          item._id === incomingItem._id ||
          getCartItemBillboardId(item) === incomingBillboardId
      );

      if (existingIndex === -1) {
        return [...items, incomingItem];
      }

      const nextItems = [...items];
      nextItems[existingIndex] = {
        ...nextItems[existingIndex],
        ...incomingItem,
      };
      return nextItems;
    },
    [getCartItemBillboardId]
  );

  const resolveCartErrorMessage = useCallback((err: any, fallback: string) => {
    if (err?.status === 401) {
      return "Please log in again to continue with your cart.";
    }

    if (typeof err?.message === "string" && err.message.trim()) {
      return err.message;
    }

    if (Array.isArray(err?.message)) {
      return err.message.join(", ");
    }

    return fallback;
  }, []);

  const loadCart = useCallback(
    async ({
      showLoader = true,
      resetOnFailure = true,
    }: LoadCartOptions = {}): Promise<CartItem[]> => {
      if (!isAuthenticated) {
        if (resetOnFailure) {
          syncCartState([]);
        }
        if (showLoader && isMountedRef.current) {
          setIsLoading(false);
        }
        return [];
      }

      if (showLoader) {
        setIsLoading(true);
      }
      setError(null);

      try {
        const items = await cartService.getCart();

        if (!isMountedRef.current) return [];

        syncCartState(items);
        return items;
      } catch (err: any) {
        console.error("Failed to fetch cart:", err);
        if (isMountedRef.current) {
          setError(resolveCartErrorMessage(err, "Failed to load cart"));
          if (resetOnFailure) {
            syncCartState([]);
          }
        }
        throw err;
      } finally {
        if (showLoader && isMountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [isAuthenticated, resolveCartErrorMessage, syncCartState]
  );

  const fetchCart = useCallback(async () => {
    try {
      await loadCart();
    } catch {
      // loadCart already updates error state
    }
  }, [loadCart]);

  useEffect(() => {
    isMountedRef.current = true;

    if (!isAuthenticated) {
      setError(null);
      setPendingItemIds([]);
      syncCartState([]);
      setIsLoading(false);
    } else {
      void fetchCart();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchCart, isAuthenticated, syncCartState]);

  const addToCart = useCallback(
    async (data: AddToCartRequest): Promise<CartItem | null> => {
      if (!isAuthenticated) {
        showToast?.({
          type: "warning",
          message: "Please login to add items to cart",
          duration: 3000,
        });
        return null;
      }

      setError(null);

      const existingItem = cartItemsRef.current.find(
        (item) => getCartItemBillboardId(item) === data.billboardId
      );

      if (existingItem) {
        showToast?.({
          type: "info",
          message: "This item is already in your cart",
          duration: 2500,
        });
        return existingItem;
      }

      try {
        const newItem = await cartService.addToCart(data);

        if (!isMountedRef.current) return newItem ?? null;

        let resolvedItem = newItem;

        try {
          const serverItems = await loadCart({
            showLoader: false,
            resetOnFailure: false,
          });
          const hydratedItem = serverItems.find(
            (item) => getCartItemBillboardId(item) === data.billboardId
          );

          if (hydratedItem) {
            resolvedItem = hydratedItem;
          } else if (newItem) {
            const updatedItems = upsertCartItem(
              cartItemsRef.current,
              newItem
            );
            syncCartState(updatedItems);
          }
        } catch (refreshErr) {
          console.error("Failed to refresh cart after add:", refreshErr);
          if (newItem) {
            const updatedItems = upsertCartItem(
              cartItemsRef.current,
              newItem
            );
            syncCartState(updatedItems);
          }
        }

        showToast?.({
          type: "success",
          message: "Item added to cart successfully",
          duration: 3000,
        });

        return resolvedItem ?? null;
      } catch (err: any) {
        console.error("Failed to add to cart:", err);
        const errorMsg = resolveCartErrorMessage(
          err,
          "Failed to add item to cart"
        );
        setError(errorMsg);
        showToast?.({
          type: "error",
          message: errorMsg,
          duration: 3000,
        });
        throw err;
      }
    },
    [
      getCartItemBillboardId,
      isAuthenticated,
      loadCart,
      resolveCartErrorMessage,
      showToast,
      syncCartState,
      upsertCartItem,
    ]
  );

  const updateCartItem = useCallback(
    async (
      id: string,
      data: UpdateCartItemRequest
    ): Promise<CartItem | null> => {
      setError(null);

      const previousItems = cartItemsRef.current;
      const itemToUpdate = previousItems.find((item) => item._id === id);

      if (!itemToUpdate) {
        setError("Item not found in cart");
        showToast?.({
          type: "error",
          message: "Item not found in cart",
          duration: 3000,
        });
        return null;
      }

      const optimisticItem = { ...itemToUpdate, ...data };
      const optimisticItems = previousItems.map((item) =>
        item._id === id ? optimisticItem : item
      );

      const billboardId = getCartItemBillboardId(itemToUpdate);

      if (!billboardId) {
        setError("Billboard information is missing for this cart item");
        showToast?.({
          type: "error",
          message: "Billboard information is missing for this cart item",
          duration: 3000,
        });
        return null;
      }

      setItemPendingState(id, true);
      syncCartState(optimisticItems);

      try {
        const payload: UpdateCartItemPayload = {
          billboardId,
          durationInMonths:
            optimisticItem.durationInMonths ?? itemToUpdate.durationInMonths,
          startDate: optimisticItem.startDate ?? itemToUpdate.startDate,
        };

        const updatedItem = await cartService.updateCartItem(id, payload);

        if (!isMountedRef.current) return updatedItem;

        const serverUpdatedItems = optimisticItems.map((item) =>
          item._id === id ? { ...item, ...updatedItem } : item
        );

        syncCartState(serverUpdatedItems);

        showToast?.({
          type: "success",
          message: "Cart updated successfully",
          duration: 2000,
        });

        return updatedItem;
      } catch (err: any) {
        console.error("Failed to update cart item:", err);

        if (!isMountedRef.current) return null;

        syncCartState(previousItems);

        const errorMsg = resolveCartErrorMessage(
          err,
          "Failed to update cart item"
        );
        setError(errorMsg);
        showToast?.({
          type: "error",
          message: errorMsg,
          duration: 3000,
        });

        return null;
      } finally {
        if (isMountedRef.current) {
          setItemPendingState(id, false);
        }
      }
    },
    [
      getCartItemBillboardId,
      resolveCartErrorMessage,
      setItemPendingState,
      showToast,
      syncCartState,
    ]
  );

  const removeFromCart = useCallback(
    async (id: string): Promise<boolean> => {
      setError(null);

      const previousItems = cartItemsRef.current;
      const hasItemToRemove = previousItems.some((item) => item._id === id);

      if (!hasItemToRemove) {
        setError("Item not found in cart");
        showToast?.({
          type: "error",
          message: "Item not found in cart",
          duration: 3000,
        });
        return false;
      }

      const updatedItems = previousItems.filter((item) => item._id !== id);

      setItemPendingState(id, true);
      syncCartState(updatedItems);

      try {
        await cartService.removeFromCart(id);

        if (!isMountedRef.current) {
          return true;
        }

        showToast?.({
          type: "success",
          message: "Item removed from cart",
          duration: 2000,
        });

        return true;
      } catch (err: any) {
        console.error("Failed to remove from cart:", err);

        if (!isMountedRef.current) return false;

        syncCartState(previousItems);

        const errorMsg = resolveCartErrorMessage(
          err,
          "Failed to remove item from cart"
        );
        setError(errorMsg);
        showToast?.({
          type: "error",
          message: errorMsg,
          duration: 3000,
        });

        return false;
      } finally {
        if (isMountedRef.current) {
          setItemPendingState(id, false);
        }
      }
    },
    [resolveCartErrorMessage, setItemPendingState, showToast, syncCartState]
  );

  const clearCart = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const previousItems = cartItemsRef.current;
    // Optimistic clear so UI empties immediately
    syncCartState([]);

    try {
      await cartService.clearCart();

      showToast?.({
        type: "success",
        message: "Cart cleared successfully",
        duration: 2000,
      });

      return true;
    } catch (err: any) {
      console.error("Failed to clear cart:", err);

      // If backend has no clear endpoint or fails, keep local empty
      // after successful payment we still want cart empty in UI
      const status = err?.status;
      if (status === 404 || status === 405) {
        syncCartState([]);
        return true;
      }

      syncCartState(previousItems);

      const errorMsg = resolveCartErrorMessage(err, "Failed to clear cart");
      setError(errorMsg);
      showToast?.({
        type: "error",
        message: errorMsg,
        duration: 3000,
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  }, [resolveCartErrorMessage, showToast, syncCartState]);

  const isCartItemPending = useCallback(
    (id: string): boolean => pendingItemIds.includes(id),
    [pendingItemIds]
  );

  const isItemInCart = useCallback(
    (billboardId: string): boolean =>
      cartItems.some(
        (item) => getCartItemBillboardId(item) === billboardId
      ),
    [cartItems, getCartItemBillboardId]
  );

  const getCartItemByBillboardId = useCallback(
    (billboardId: string): CartItem | undefined =>
      cartItems.find(
        (item) => getCartItemBillboardId(item) === billboardId
      ),
    [cartItems, getCartItemBillboardId]
  );

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
    isCartItemPending,
    isItemInCart,
    getCartItemByBillboardId,
  };
}