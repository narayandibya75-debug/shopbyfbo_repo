import React from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { INR, productImage } from "../lib/api";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartDrawer() {
  const { cart, open, setOpen, update, remove } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const items = cart.items || [];

  const goCheckout = () => {
    setOpen(false);
    navigate(user ? "/checkout" : "/login?redirect=/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0" data-testid="cart-drawer">
        <SheetHeader className="px-6 py-5 border-b">
          <SheetTitle className="font-heading flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" /> Your Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="h-16 w-16 mx-auto rounded-full bg-muted grid place-items-center mb-4">
                <ShoppingBag className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-heading text-lg">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Add some Forever goodness ✨</p>
              <button onClick={() => { setOpen(false); navigate("/shop"); }}
                      className="btn-primary mt-6" data-testid="cart-shop-now">
                Shop now <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((it) => (
                <li key={it.product.product_id} className="flex gap-3 p-3 rounded-xl border border-border/50 bg-white"
                    data-testid={`cart-item-${it.product.product_id}`}>
                  <img src={productImage(it.product.images)} alt="" className="h-20 w-20 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-heading font-semibold leading-tight line-clamp-2">{it.product.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{it.product.category}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button onClick={() => update(it.product.product_id, it.quantity - 1)}
                                className="h-7 w-7 grid place-items-center hover:bg-muted rounded-l-full"
                                aria-label="decrease" data-testid={`cart-dec-${it.product.product_id}`}>
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-sm font-medium">{it.quantity}</span>
                        <button onClick={() => update(it.product.product_id, it.quantity + 1)}
                                className="h-7 w-7 grid place-items-center hover:bg-muted rounded-r-full"
                                aria-label="increase" data-testid={`cart-inc-${it.product.product_id}`}>
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="font-heading font-semibold text-primary">{INR(it.line_total)}</div>
                    </div>
                  </div>
                  <button onClick={() => remove(it.product.product_id)}
                          className="self-start p-1 text-muted-foreground hover:text-destructive"
                          aria-label="remove" data-testid={`cart-remove-${it.product.product_id}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t bg-muted/30 px-6 py-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold" data-testid="cart-subtotal">{INR(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Total BV</span><span>{(cart.total_bv || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Total CC</span><span>{(cart.total_cc || 0).toFixed(3)}</span>
            </div>
            <button onClick={goCheckout} className="btn-primary w-full" data-testid="cart-checkout-btn">
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
