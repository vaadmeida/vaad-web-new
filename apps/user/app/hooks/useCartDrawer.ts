import { useState } from "react";

export function useCartDrawer() {
  const [open, setOpen] = useState(false);

  const openCart = () => setOpen(true);
  const closeCart = () => setOpen(false);

  return {
    open,
    openCart,
    closeCart,
  };
}