import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface WishlistItem {
  dealID: string;
  gameID: string;
  title: string;
  thumb: string;
  steamAppID: string | null;
  salePrice: string;
  normalPrice: string;
  savings: string;
  storeID: string;
  targetPrice?: number;
  addedAt: number;
}

interface WishlistContextType {
  items: WishlistItem[];
  add: (item: Omit<WishlistItem, "addedAt">) => void;
  remove: (gameID: string) => void;
  isWishlisted: (gameID: string) => boolean;
  setTargetPrice: (gameID: string, price: number | undefined) => void;
  belowTargetCount: number;
}

const STORAGE_KEY = "gamedeals-wishlist";

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function load(): WishlistItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function save(items: WishlistItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(load);

  useEffect(() => {
    save(items);
  }, [items]);

  const add = useCallback((item: Omit<WishlistItem, "addedAt">) => {
    setItems((prev) => {
      if (prev.some((i) => i.gameID === item.gameID)) return prev;
      return [{ ...item, addedAt: Date.now() }, ...prev];
    });
  }, []);

  const remove = useCallback((gameID: string) => {
    setItems((prev) => prev.filter((i) => i.gameID !== gameID));
  }, []);

  const isWishlisted = useCallback(
    (gameID: string) => items.some((i) => i.gameID === gameID),
    [items]
  );

  const setTargetPrice = useCallback((gameID: string, price: number | undefined) => {
    setItems((prev) =>
      prev.map((i) => (i.gameID === gameID ? { ...i, targetPrice: price } : i))
    );
  }, []);

  const belowTargetCount = items.filter(
    (i) => i.targetPrice !== undefined && parseFloat(i.salePrice) <= i.targetPrice
  ).length;

  return (
    <WishlistContext.Provider value={{ items, add, remove, isWishlisted, setTargetPrice, belowTargetCount }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
