import React, { useEffect, useState } from "react";
import { api, INR, productImage, unwrapList } from "../../lib/api";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import ProductFormModal from "./ProductFormModal";
import SEO from "../../components/SEO";


const STATUS_CHIP = {
  active: "bg-green-50 text-green-700",
  out_of_stock: "bg-yellow-50 text-yellow-700",
  discontinued: "bg-stone-100 text-stone-700",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/products");
      setProducts(unwrapList(data));
    } finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  const filtered = q
    ? products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase()))
    : products;

  const onDelete = async (p) => {
    if (!window.confirm(`Delete ${p.name}?`)) return;
    try {
      await api.delete(`/admin/products/${p.product_id}`);
      toast.success("Product deleted");
      refresh();
    } catch { toast.error("Failed to delete"); }
  };

  const onStatus = async (p, status) => {
    try {
      const fd = new FormData();
      fd.append("status", status);
      await api.patch(`/admin/products/${p.product_id}/status`, fd);
      toast.success("Status updated");
      refresh();
    } catch { toast.error("Failed"); }
  };

  return (
    <>
    {/* PRIVATE AREA BLOCKADE - INTERCEPTS GOOGLEBOT */}
    <SEO 
      title="Inventory Database Management Dashboard" 
      url="/admin/products" 
      robots="noindex, nofollow" 
    />
    <div data-testid="admin-products">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="font-heading font-bold text-3xl">Products</h1>
          <p className="text-sm text-muted-foreground">Manage catalog — add new or mark out-of-stock / discontinued.</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary" data-testid="add-product-btn">
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      <div className="mb-4 relative w-full sm:max-w-sm">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="pl-9 bg-white" data-testid="admin-products-search" />
      </div>

      <div className="rounded-2xl bg-white border border-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">BV / CC</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr><td colSpan={6} className="py-10 text-center text-muted-foreground">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-muted-foreground">No products.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.product_id} className="hover:bg-muted/30" data-testid={`admin-product-row-${p.product_id}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={productImage(p.images)} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <div className="font-medium line-clamp-1">{p.name}</div>
                        {p.sku && <div className="text-[11px] text-muted-foreground">{p.sku}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3 font-heading font-semibold">{INR(p.price)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{p.bv} / {p.cc}</td>
                  <td className="px-4 py-3">
                    <select value={p.status} onChange={(e) => onStatus(p, e.target.value)}
                            className={`chip ${STATUS_CHIP[p.status]} border-0 px-2.5 py-1 text-xs font-medium focus:outline-none bg-transparent cursor-pointer`}
                            data-testid={`status-select-${p.product_id}`}>
                      <option value="active">Active</option>
                      <option value="out_of_stock">Out of stock</option>
                      <option value="discontinued">Discontinued</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => { setEditing(p); setModalOpen(true); }} className="p-2 rounded-lg hover:bg-muted" data-testid={`edit-product-${p.product_id}`}>
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => onDelete(p)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive" data-testid={`delete-product-${p.product_id}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <ProductFormModal
          product={editing}
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); refresh(); }}
        />
      )}
    </div>
    </>
  );
}
