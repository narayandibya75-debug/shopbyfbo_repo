import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, total_bv: 0, total_cc: 0 });
  const [open, setOpen] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setCart({ items: [], subtotal: 0, total_bv: 0, total_cc: 0 });
      return;
    }
    try {
      const { data } = await api.get("/cart");
      setCart(data);
    } catch {
      setCart({ items: [], subtotal: 0, total_bv: 0, total_cc: 0 });
    }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const add = async (product_id, quantity = 1) => {
    await api.post("/cart/add", { product_id, quantity });
    await refresh();
    setOpen(true);
  };
  const update = async (product_id, quantity) => {
    await api.post("/cart/update", { product_id, quantity });
    await refresh();
  };
  const remove = async (product_id) => {
    const fd = new FormData();
    fd.append("product_id", product_id);
    await api.post("/cart/remove", fd);
    await refresh();
  };
  const clear = async () => { await api.post("/cart/clear"); await refresh(); };

  const itemCount = (cart.items || []).reduce((n, i) => n + (i.quantity || 0), 0);

  return (
    <CartContext.Provider value={{ cart, refresh, add, update, remove, clear, open, setOpen, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}
