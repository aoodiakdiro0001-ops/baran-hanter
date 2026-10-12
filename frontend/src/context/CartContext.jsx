import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bh_cart") || "[]");
    } catch {
      return [];
    }
  });

  const persist = (next) => {
    setItems(next);
    localStorage.setItem("bh_cart", JSON.stringify(next));
  };

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      add: (product, qty = 1) => {
        const next = [...items];
        const found = next.find((i) => i.productId === product.id);
        if (found) found.qty = Math.min(20, found.qty + qty);
        else
          next.push({
            productId: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            brand: product.brand,
            qty,
          });
        persist(next);
      },
      setQty: (productId, qty) => {
        persist(
          items
            .map((i) => (i.productId === productId ? { ...i, qty } : i))
            .filter((i) => i.qty > 0)
        );
      },
      clear: () => persist([]),
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
