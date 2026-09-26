"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  priceKes: number;
  imageUrl?: string | null;
  quantity: number;
}

interface CartApi {
  items: CartItem[];
  count: number;
  subtotalKes: number;
  ready: boolean;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQty: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const STORAGE_KEY = "ws_cart";

const CartContext = createContext<CartApi | null>(null);

function readStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((i) => i && typeof i.productId === "string")
      .map((i) => ({
        productId: String(i.productId),
        slug: String(i.slug ?? ""),
        name: String(i.name ?? "Item"),
        priceKes: Number(i.priceKes) || 0,
        imageUrl: i.imageUrl ?? null,
        quantity: Math.max(1, Math.min(99, Math.trunc(Number(i.quantity) || 1))),
      }));
  } catch {
    return [];
  }
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage after mount. The first client render must match
  // the server (empty cart) to avoid a hydration mismatch, so this deliberately
  // sets state once on mount rather than using a lazy initializer.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — cart stays in memory only */
    }
  }, [items, ready]);

  // Keep in sync across tabs.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback<CartApi["add"]>((item, quantity = 1) => {
    const q = Math.max(1, Math.min(99, Math.trunc(quantity)));
    setItems((prev) => {
      const found = prev.find((i) => i.productId === item.productId);
      if (found) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: Math.min(99, i.quantity + q) }
            : i,
        );
      }
      return [...prev, { ...item, quantity: q }];
    });
  }, []);

  const setQty = useCallback<CartApi["setQty"]>((productId, quantity) => {
    const q = Math.trunc(quantity);
    setItems((prev) =>
      q <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.min(99, q) }
              : i,
          ),
    );
  }, []);

  const remove = useCallback<CartApi["remove"]>((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartApi>(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotalKes = items.reduce((n, i) => n + i.priceKes * i.quantity, 0);
    return { items, count, subtotalKes, ready, add, setQty, remove, clear };
  }, [items, ready, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
