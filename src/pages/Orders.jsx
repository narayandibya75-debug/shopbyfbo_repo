import React, { useEffect, useState } from "react";
import { api, INR, productImage, unwrapList } from "../lib/api";
import { Package, Truck, CheckCircle2, Clock } from "lucide-react";

const STATUS_MAP = {
  awaiting_payment:      { label: "Awaiting payment", icon: Clock, color: "bg-orange-50 text-orange-700" },
  awaiting_verification: { label: "Awaiting verification", icon: Clock, color: "bg-yellow-50 text-yellow-700" },
  payment_failed:        { label: "Payment failed", icon: Clock, color: "bg-red-50 text-red-700" },
  pending_payment:       { label: "Pending", icon: Clock, color: "bg-yellow-50 text-yellow-700" },
  confirmed:             { label: "Confirmed", icon: CheckCircle2, color: "bg-green-50 text-green-700" },
  shipped:               { label: "Shipped", icon: Truck, color: "bg-blue-50 text-blue-700" },
  delivered:             { label: "Delivered", icon: Package, color: "bg-emerald-50 text-emerald-700" },
  cancelled:             { label: "Cancelled", icon: Clock, color: "bg-red-50 text-red-700" },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders")
      .then((r) => setOrders(unwrapList(r.data)))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-ff py-10" data-testid="orders-page">
      <h1 className="font-heading font-bold text-3xl sm:text-4xl">My orders</h1>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="mt-10 p-12 rounded-3xl border border-dashed text-center">
          <Package className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-lg font-heading">No orders yet</p>
          <p className="text-sm text-muted-foreground mt-1">Start shopping to see orders here.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {orders.map((o) => {
            const s = STATUS_MAP[o.status] || STATUS_MAP.confirmed;
            const SI = s.icon;
            return (
              <div key={o.order_id} className="p-6 rounded-2xl bg-white border border-border/60" data-testid={`order-card-${o.order_id}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="font-heading font-semibold">Order #{o.order_id.split("_")[1]}</div>
                    <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("en-IN")}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`chip ${s.color}`}><SI className="h-3 w-3" /> {s.label}</span>
                    <span className="font-heading font-bold text-primary">{INR(o.total)}</span>
                  </div>
                </div>
                <ul className="divide-y divide-border/60">
                  {o.items.map((it, idx) => (
                    <li key={idx} className="py-3 flex gap-3 items-center">
                      <img src={productImage([it.image])} alt="" className="h-14 w-14 rounded-lg object-cover" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{it.name}</div>
                        <div className="text-xs text-muted-foreground">Qty {it.quantity} · BV {it.bv} · CC {it.cc}</div>
                      </div>
                      <div className="text-sm font-semibold">{INR(it.price * it.quantity)}</div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-xs text-muted-foreground">
                  Shipping to {o.address?.full_name}, {o.address?.city}, {o.address?.state} — {o.address?.pincode}
                </div>
                {o.payment_ref && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    UPI Ref / UTR: <span className="font-mono font-medium">{o.payment_ref}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
