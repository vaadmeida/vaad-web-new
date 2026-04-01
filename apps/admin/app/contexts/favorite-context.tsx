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
import { billboardService, Billboard } from "@/app/lib/billboard/billboard-service";
import { useAuthContext } from "@/app/contexts/auth-context";

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

// COMPLETE interface - all properties explicitly typed
interface FavoriteContextType {
  favorites: FavoriteState;
  isLoading: boolean;
  isHydrated: boolean;
  toggleFavorite: (billboardId: string) => Promise<boolean>;
  isFavorite: (billboardId: string) => boolean;
  getFavoriteCount: () => number;
  syncWithServer: () => Promise<void>;
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
  // State
  const [favorites, setFavorites] = useState<FavoriteState>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const { isAuthenticated } = useAuthContext();
  
  // Refs
  const pendingOps = useRef<Map<string, PendingOperation>>(new Map());
  const mounted = useRef(true);
  const isSyncing = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      pendingOps.current.forEach((op) => op.abortController.abort());
      pendingOps.current.clear();
    };
  }, []);

  // ==========================================
  // HYDRATION: Load from localStorage FIRST
  // ==========================================

  useEffect(() => {
    // Step 1: Instant load from localStorage
    const cached = storage.get();
    if (Object.keys(cached).length > 0) {
      setFavorites(cached);
    }
    setIsHydrated(true);

    // Step 2: Background sync with server
    if (isAuthenticated) {
      syncWithServer();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Persist to localStorage on every change
  useEffect(() => {
    if (isHydrated) {
      storage.set(favorites);
    }
  }, [favorites, isHydrated]);

  // ==========================================
  // SERVER SYNC
  // ==========================================

  const syncWithServer = useCallback(async () => {
    if (!isAuthenticated || isSyncing.current) return;
    
    isSyncing.current = true;
    setIsLoading(true);

    try {
      const serverFavorites = await billboardService.getFavorites();
      
      const serverMap: FavoriteState = {};
      serverFavorites.forEach((item: Billboard) => {
        if (item?._id) serverMap[item._id] = true;
      });

      if (mounted.current) {
        setFavorites((current) => {
          // Don't overwrite pending operations
          const pendingIds = Array.from(pendingOps.current.keys());
          const merged = { ...serverMap };
          
          pendingIds.forEach((id) => {
            if (current[id] !== undefined) {
              merged[id] = current[id];
            }
          });

          return merged;
        });
      }
    } catch (error) {
      console.error("Failed to sync favorites:", error);
      // Keep localStorage version on error
    } finally {
      if (mounted.current) {
        setIsLoading(false);
        isSyncing.current = false;
      }
    }
  }, [isAuthenticated]);

  // ==========================================
  // TOGGLE (Optimistic)
  // ==========================================

  const toggleFavorite = useCallback(
    async (billboardId: string): Promise<boolean> => {
      if (!billboardId || !isAuthenticated) return false;

      // Debounce check
      const now = Date.now();
      const existingOp = pendingOps.current.get(billboardId);
      if (existingOp && (now - existingOp.timestamp) < DEBOUNCE_MS) {
        console.log("Debounced");
        return false;
      }

      // Check for pending request
      if (existingOp) {
        return existingOp.promise;
      }

      // Read current value
      const currentValue = favorites[billboardId] || false;
      const targetValue = !currentValue;

      // Optimistic update
      setFavorites((prev) => ({
        ...prev,
        [billboardId]: targetValue,
      }));

      // Create abort controller
      const abortController = new AbortController();

      // Async operation
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

          return serverValue;
        } catch (error) {
          // Rollback
          if (mounted.current) {
            setFavorites((prev) => ({
              ...prev,
              [billboardId]: currentValue,
            }));
          }
          throw error;
        } finally {
          setTimeout(() => {
            pendingOps.current.delete(billboardId);
          }, 0);
        }
      })();

      pendingOps.current.set(billboardId, {
        promise: operationPromise,
        abortController,
        timestamp: now,
      });

      return operationPromise;
    },
    [favorites, isAuthenticated]
  );

  // ==========================================
  // DERIVED FUNCTIONS
  // ==========================================

  const isFavorite = useCallback(
    (billboardId: string) => !!favorites[billboardId],
    [favorites]
  );

  const getFavoriteCount = useCallback(
    () => Object.keys(favorites).length,
    [favorites]
  );

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
  // CONTEXT VALUE (EXPLICITLY TYPED)
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
// HOOK (WITH PROPER TYPING)
// ==========================================

export function useFavorite(): FavoriteContextType {
  const ctx = useContext(FavoriteContext);
  if (!ctx) {
    throw new Error("useFavorite must be used within FavoriteProvider");
  }
  return ctx;
}