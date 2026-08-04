import React, { useEffect, useState } from "react";
import { api, INR, unwrapList } from "../../lib/api";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Eye, X, Trash2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";

const STATUSES = [
  ["awaiting_payment", "Awaiting payment"],
  ["awaiting_verification", "Awaiting verification"],
  ["payment_failed", "Payment failed"],
  ["confirmed", "Confirmed"],
  ["shipped", "Shipped"],
  ["delivered", "Delivered"],
  ["cancelled", "Cancelled"],
];

const STATUS_CHIP = {
  awaiting_payment: "bg-orange-50 text-orange-700",
  awaiting_verification: "bg-yellow-50 text-yellow-700",
  payment_failed: "bg-red-50 text-red-700",
  confirmed: "bg-green-50 text-green-700",
  shipped: "bg-blue-50 text-blue-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-stone-100 text-stone-700",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const refresh = async () => {
    setLoading(true);
    try { 
      const { data } = await api.get("/admin/orders"); 
      setOrders(unwrapList(data)); 
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally { 
      setLoading(false); 
    }
  };
  
  useEffect(() => { refresh(); }, []);

  const onStatus = async (o, status) => {
    try {
      const fd = new FormData();
      fd.append("status", status);
      await api.patch(`/admin/orders/${o.order_id}/status`, fd);
      toast.success("Status updated");
      refresh();
    } catch { toast.error("Failed"); }
  };

  const onPaymentAction = async (o, action) => {
    if (action === "reject" && !window.confirm("Reject this payment? Customer will need to re-pay.")) return;
    try {
      const fd = new FormData();
      fd.append("action", action);
      await api.patch(`/admin/orders/${o.order_id}/verify-payment`, fd);
      toast.success(action === "verify" ? "Payment verified — order confirmed" : "Payment rejected");
      refresh();
    } catch (e) { toast.error(e?.response?.data?.detail || "Failed"); }
  };

  // Delete order function
  const deleteOrder = async (orderId) => {
    setDeletingId(orderId);
    try {
      await api.delete(`/admin/orders/${orderId}`);
      toast.success("Order deleted successfully");
      refresh();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.detail || "Failed to delete order");
    } finally {
      setDeletingId(null);
    }
  };

  // Check if order can be deleted (only awaiting_payment, cancelled, payment_failed)
  const canDelete = (status) => {
    return ["awaiting_payment", "cancelled", "payment_failed"].includes(status);
  };

  const awaitingCount = orders.filter((o) => o.status === "awaiting_verification").length;

  return (
    <div data-testid="admin-orders">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading font-bold text-3xl">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage customer orders and verify UPI payments</p>
        </div>
        <div className="flex gap-2">
          {awaitingCount > 0 && (
            <span className="chip bg-yellow-50 text-yellow-800 border border-yellow-200" data-testid="awaiting-verification-badge">
              {awaitingCount} payment{awaitingCount > 1 ? "s" : ""} awaiting verification
            </span>
          )}
          <button onClick={refresh} className="btn-outline !py-1 !px-3 text-xs" data-testid="refresh-orders">
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white border border-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[920px] w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">UPI Ref / UTR</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr><td colSpan={7} className="py-10 text-center text-muted-foreground">Loading…</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-muted-foreground">No orders yet.</td></tr>
              ) : orders.map((o) => (
                <tr key={o.order_id} className="hover:bg-muted/30" data-testid={`admin-order-row-${o.order_id}`}>
                  <td className="px-4 py-3 font-mono text-xs">#{o.order_id.split("_")[1]}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{o.address?.full_name}</div>
                    <div className="text-[11px] text-muted-foreground">{o.user_email}</div>
                  </td>
                  <td className="px-4 py-3 font-heading font-semibold text-primary">{INR(o.total)}</td>
                  <td className="px-4 py-3">
                    {o.payment_ref ? (
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{o.payment_ref}</span>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <select value={o.status} onChange={(e) => onStatus(o, e.target.value)}
                            className={`chip ${STATUS_CHIP[o.status] || ""} border-0 text-xs px-2 py-1 focus:outline-none`}
                            data-testid={`order-status-${o.order_id}`}>
                      {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      {o.status === "awaiting_verification" && (
                        <>
                          <button onClick={() => onPaymentAction(o, "verify")}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700"
                                  data-testid={`verify-payment-${o.order_id}`}>
                            <CheckCircle2 className="h-3.5 w-3.5" /> Verify
                          </button>
                          <button onClick={() => onPaymentAction(o, "reject")}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100"
                                  data-testid={`reject-payment-${o.order_id}`}>
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </button>
                        </>
                      )}
                      
                      {/* Delete Button - Only for deletable orders */}
                      {canDelete(o.status) && (
                        <>
                          {showDeleteConfirm === o.order_id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => deleteOrder(o.order_id)}
                                disabled={deletingId === o.order_id}
                                className="px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
                                data-testid={`confirm-delete-${o.order_id}`}
                              >
                                {deletingId === o.order_id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  "Confirm"
                                )}
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-2 py-1 rounded-lg bg-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-400 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowDeleteConfirm(o.order_id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors group"
                              title="Delete order (only for pending/cancelled orders)"
                              data-testid={`delete-order-${o.order_id}`}
                            >
                              <Trash2 className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                            </button>
                          )}
                        </>
                      )}
                      
                      <button onClick={() => setViewing(o)} className="p-1.5 rounded-lg hover:bg-muted" data-testid={`view-order-${o.order_id}`}>
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Instructions */}
      <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
        <div className="flex items-start gap-2">
          <svg className="h-4 w-4 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-blue-700">
            <span className="font-medium">Delete Note:</span> Only orders with status 
            <strong> "Awaiting payment"</strong>, <strong>"Cancelled"</strong>, or 
            <strong> "Payment failed"</strong> can be deleted. Click the trash icon and confirm to remove.
          </div>
        </div>
      </div>

      {/* Order Details Dialog */}
      {viewing && (
        <Dialog open={true} onOpenChange={(o) => !o && setViewing(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">Order #{viewing.order_id.split("_")[1]}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <Info label="Customer" v={viewing.address?.full_name} />
                <Info label="Email" v={viewing.user_email} />
                <Info label="Phone" v={viewing.address?.phone} />
                <Info label="UPI Ref / UTR" v={viewing.payment_ref || "—"} mono />
                <Info label="Total" v={INR(viewing.total)} bold />
                <Info label="Status" v={viewing.status} />
              </div>
              <div className="p-3 rounded-lg bg-muted/40">
                <div className="text-xs text-muted-foreground mb-1">Shipping address</div>
                <div>{viewing.address?.line1}{viewing.address?.line2 ? `, ${viewing.address.line2}` : ""}</div>
                <div>{viewing.address?.city}, {viewing.address?.state} — {viewing.address?.pincode}</div>
              </div>
              <div>
                <div className="font-heading font-semibold mb-2">Items ({viewing.items?.length})</div>
                <ul className="divide-y divide-border/60">
                  {viewing.items?.map((it, i) => (
                    <li key={i} className="py-2 flex justify-between gap-2">
                      <span className="truncate">{it.name} × {it.quantity}</span>
                      <span className="shrink-0 font-medium">{INR(it.price * it.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-xs text-muted-foreground">
                Total BV: {(viewing.total_bv || 0).toFixed(2)} · Total CC: {(viewing.total_cc || 0).toFixed(3)}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function Info({ label, v, bold, mono }) {
  return (
    <div>
      <div className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className={`mt-0.5 ${bold ? "font-heading font-bold text-primary text-lg" : ""} ${mono ? "font-mono" : ""}`}>{v}</div>
    </div>
  );
}
