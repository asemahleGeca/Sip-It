import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { CartLine, Product } from "../models/product";

type CartContextValue = {
  items: CartLine[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, size: string) => void;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  removeItem: (productId: string, size: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);

  const addItem = useCallback((product: Product, size: string) => {
    setItems((current) => {
      const existing = current.find(
        (item) => item.product.id === product.id && item.size === size,
      );
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item,
        );
      }
      return [...current, { product, size, quantity: 1 }];
    });
  }, []);

  const setQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      setItems((current) =>
        current
          .map((item) =>
            item.product.id === productId && item.size === size
              ? { ...item, quantity: Math.min(quantity, item.product.stock) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      );
    },
    [],
  );

  const removeItem = useCallback((productId: string, size: string) => {
    setItems((current) =>
      current.filter((item) => item.product.id !== productId || item.size !== size),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
      subtotal: items.reduce((total, item) => total + item.product.price * item.quantity, 0),
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    }),
    [items, addItem, setQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider.");
  return context;
}
