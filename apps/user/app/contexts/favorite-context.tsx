"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  createContext,
  useContext,
  useMemo,
} from "react";
import { billboardService } from "@/app/lib/billboard/billboard-service";
import { useAuthContext } from "@/app/contexts/auth-context";
import { useToast } from "@/app/contexts/toast-context";

// ==========================================
// TYPES
// ==========================================

interface FavoriteState {
  [billboardId: string]: boolean;
}

interface PendingOperation {
  promise: Promise<boolean>;
  abortController: AbortController;
  timestamp: number;
}

interface FavoriteContextType {
  favorites: FavoriteState;
  isLoading: boolean;
  isHydrated: boolean;
  toggleFavorite: (billboardId: string) => Promise<boolean>;
  isFavorite: (billboardId: string) => boolean;
  getFavoriteCount: () => number;
  syncWithServer: () => Promise<void>; // kept for API compatibility (does nothing now)
}

// ==========================================
// CONTEXT CREATION
// ==========================================

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

// ==========================================
// CONSTANTS
// ==========================================

const DEBOUNCE_MS = 300;
const STALE_REQUEST_MS = 10000;
const STORAGE_KEY = "billboard_favorites_v1";

// ==========================================
// STORAGE UTILS (SSR-Safe)
// ==========================================

const storage = {
  get: (): FavoriteState => {
    if (typeof window === "undefined") return {};
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },
  
  set: (state: FavoriteState) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to persist favorites:", e);
    }
  },
  
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  }
};

// ==========================================
// PROVIDER
// ==========================================

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteState>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const { isAuthenticated } = useAuthContext();
  const { showToast } = useToast();
  
  const pendingOps = useRef<Map<string, PendingOperation>>(new Map());
  const mounted = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    mounted.current = true;
    const currentPendingOps = pendingOps.current;

    return () => {
      mounted.current = false;
      currentPendingOps.forEach((op) => op.abortController.abort());
      currentPendingOps.clear();
    };
  }, []);

  // ==========================================
  // HYDRATION: Load from localStorage
  // ==========================================

  useEffect(() => {
    // Load instantly from localStorage
    const cached = storage.get();
    if (Object.keys(cached).length > 0) {
      setFavorites(cached);
    }
    setIsHydrated(true);
    setIsLoading(false); // No server sync anymore
  }, []);

  // Persist to localStorage whenever favorites change
  useEffect(() => {
    if (isHydrated) {
      storage.set(favorites);
    }
  }, [favorites, isHydrated]);

  // ==========================================
  // TOGGLE FAVORITE (Optimistic Update)
  // ==========================================

  const toggleFavorite = useCallback(
    async (billboardId: string): Promise<boolean> => {
      if (!billboardId) return false;

      const now = Date.now();
      const existingOp = pendingOps.current.get(billboardId);

      // Debounce
      if (existingOp && (now - existingOp.timestamp) < DEBOUNCE_MS) {
        return false;
      }

      // Return existing promise if already in flight
      if (existingOp) {
        return existingOp.promise;
      }

      const currentValue = favorites[billboardId] || false;
      const targetValue = !currentValue;

      // Optimistic UI update
      setFavorites((prev) => ({
        ...prev,
        [billboardId]: targetValue,
      }));

      if (!isAuthenticated) {
        const message = targetValue
          ? "This billboard has been added to your favorites."
          : "This billboard has been removed from your favorites.";

        showToast({
          type: targetValue ? "success" : "info",
          title: targetValue ? "Favorite added" : "Favorite removed",
          message,
          duration: 2600,
        });

        return targetValue;
      }

      const abortController = new AbortController();

      const operationPromise = (async (): Promise<boolean> => {
        try {
          const result = await billboardService.toggleFavorite(billboardId);
          const serverValue = result?.isFavorited ?? targetValue;

          if (mounted.current) {
            setFavorites((prev) => ({
              ...prev,
              [billboardId]: serverValue,
            }));
          }

          showToast({
            type: "success",
            title: serverValue ? "Added to favorites" : "Removed from favorites",
            message: serverValue
              ? "This billboard is now in your favorites list."
              : "This billboard has been removed from your favorites.",
            duration: 2600,
          });

          return serverValue;
        } catch (error) {
          if (mounted.current) {
            setFavorites((prev) => ({
              ...prev,
              [billboardId]: currentValue,
            }));
          }

          const errorMessage =
            error instanceof Error && error.message
              ? error.message
              : "We could not update your favorites right now.";

          showToast({
            type: "error",
            title: "Favorite update failed",
            message: errorMessage,
            duration: 3200,
          });

          throw error;
        } finally {
          pendingOps.current.delete(billboardId);
        }
      })();

      pendingOps.current.set(billboardId, {
        promise: operationPromise,
        abortController,
        timestamp: now,
      });

      return operationPromise;
    },
    [favorites, isAuthenticated, showToast]
  );

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  const isFavorite = useCallback(
    (billboardId: string) => !!favorites[billboardId],
    [favorites]
  );

  const getFavoriteCount = useCallback(
    () => Object.keys(favorites).length,
    [favorites]
  );

  // Dummy sync function (kept for compatibility)
  const syncWithServer = useCallback(async () => {
    // No getFavorites endpoint exists, so we do nothing
    // LocalStorage + toggle is the source of truth now
    console.warn("syncWithServer: getFavorites endpoint not available. Using local state.");
  }, []);

  // Cleanup stale operations
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      pendingOps.current.forEach((op, id) => {
        if (now - op.timestamp > STALE_REQUEST_MS) {
          op.abortController.abort();
          pendingOps.current.delete(id);
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const contextValue: FavoriteContextType = useMemo(
    () => ({
      favorites,
      isLoading,
      isHydrated,
      toggleFavorite,
      isFavorite,
      getFavoriteCount,
      syncWithServer,
    }),
    [favorites, isLoading, isHydrated, toggleFavorite, isFavorite, getFavoriteCount, syncWithServer]
  );

  return (
    <FavoriteContext.Provider value={contextValue}>
      {children}
    </FavoriteContext.Provider>
  );
}

// ==========================================
// HOOK
// ==========================================

export function useFavorite(): FavoriteContextType {
  const ctx = useContext(FavoriteContext);
  if (!ctx) {
    throw new Error("useFavorite must be used within FavoriteProvider");
  }
  return ctx;
}