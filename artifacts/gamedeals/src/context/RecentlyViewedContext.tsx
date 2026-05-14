import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface RecentlyViewedItem {
  gameID: string;
  title: string;
  thumb: string;
  steamAppID: string | null;
  viewedAt: number;
}

interface RecentlyViewedContextType {
  items: RecentlyViewedItem[];
  track: (item: Omit<RecentlyViewedItem, "viewedAt">) => void;
  clear: () => void;
}

const STORAGE_KEY = "gamedeals-recently-viewed";
const MAX_ITEMS = 8;

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

function load(): RecentlyViewedItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function save(items: RecentlyViewedItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RecentlyViewedItem[]>(load);

  useEffect(() => {
    save(items);
  }, [items]);

  const track = useCallback((item: Omit<RecentlyViewedItem, "viewedAt">) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.gameID !== item.gameID);
      return [{ ...item, viewedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return (
    <RecentlyViewedContext.Provider value={{ items, track, clear }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
  return ctx;
}
