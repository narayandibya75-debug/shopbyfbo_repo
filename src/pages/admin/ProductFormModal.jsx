import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { api, productImage, formatApiErrorDetail } from "../../lib/api";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";
const CATEGORIES = [
  "Aloe Drinks",
  "Bee Products",
  "Personal Care",
  "Nutrition",
  "Weight Management",
  "Skincare",
];
const STATUSES = [
  ["active", "Active"],
  ["out_of_stock", "Out of stock"],
  ["discontinued", "Discontinued"],
];

export default function ProductFormModal({ product, onClose, onSaved }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || CATEGORIES[0],
    mrp: product?.mrp || 0,
    price: product?.price || 0,
    bv: product?.bv || 0,
    cc: product?.cc || 0,
    stock: product?.stock || 0,
    status: product?.status || "active",
    images: product?.images || [],
    featured: !!product?.featured,
    sku: product?.sku || "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const setField = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setNum = (k) => (e) => setForm({ ...form, [k]: Number(e.target.value) });

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      // Use axios instance so the auth token is included automatically
      const { data } = await api.post("/admin/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // data.url is the full URL e.g. http://localhost:8001/uploads/abc.jpg
      setForm((f) => ({ ...f, images: [...f.images, data.url] }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(
        formatApiErrorDetail(err?.response?.data?.detail) || "Upload failed"
      );
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = (idx) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        mrp: Number(form.mrp),
        price: Number(form.price),
        bv: Number(form.bv),
        cc: Number(form.cc),
        stock: Number(form.stock),
      };
      if (isEdit) await api.put(`/admin/products/${product.product_id}`, payload);
      else await api.post("/admin/products", payload);
      toast.success(isEdit ? "Product updated" : "Product created");
      onSaved();
    } catch (err) {
      toast.error(
        formatApiErrorDetail(err?.response?.data?.detail) || "Save failed"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-testid="product-form-modal"
      >
        <DialogHeader>
          <DialogTitle className="font-heading">
            {isEdit ? "Edit product" : "Add new product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <F label="Name" className="sm:col-span-2">
              <Input required value={form.name} onChange={setField("name")} data-testid="pf-name" />
            </F>
            <F label="SKU">
              <Input value={form.sku} onChange={setField("sku")} data-testid="pf-sku" />
            </F>
            <F label="Category">
              <select
                value={form.category}
                onChange={setField("category")}
                className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
                data-testid="pf-category"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </F>
            <F label="MRP (₹)">
              <Input type="number" min="0" step="0.01" value={form.mrp} onChange={setNum("mrp")} data-testid="pf-mrp" />
            </F>
            <F label="Price (₹)">
              <Input type="number" min="0" step="0.01" value={form.price} onChange={setNum("price")} required data-testid="pf-price" />
            </F>
            <F label="BV">
              <Input type="number" min="0" step="0.01" value={form.bv} onChange={setNum("bv")} data-testid="pf-bv" />
            </F>
            <F label="CC">
              <Input type="number" min="0" step="0.001" value={form.cc} onChange={setNum("cc")} data-testid="pf-cc" />
            </F>
            <F label="Stock">
              <Input type="number" min="0" value={form.stock} onChange={setNum("stock")} data-testid="pf-stock" />
            </F>
            <F label="Status">
              <select
                value={form.status}
                onChange={setField("status")}
                className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
                data-testid="pf-status"
              >
                {STATUSES.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </F>
            <F label="Description" className="sm:col-span-2">
              <Textarea rows={3} value={form.description} onChange={setField("description")} data-testid="pf-description" />
            </F>
            <F label="Featured" className="sm:col-span-2">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  data-testid="pf-featured"
                />
                <span className="text-sm">Show on homepage</span>
              </label>
            </F>
          </div>

          <div>
            <Label className="mb-2 block text-xs">Product images</Label>
            <div className="flex flex-wrap gap-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative h-20 w-20 rounded-lg overflow-hidden border">
                  <img src={productImage([img])} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-0.5 right-0.5 h-5 w-5 bg-white/90 rounded-full grid place-items-center"
                    data-testid={`remove-img-${i}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label
                className="h-20 w-20 border border-dashed border-border rounded-lg grid place-items-center cursor-pointer hover:bg-muted/30 transition-colors text-muted-foreground"
                data-testid="image-upload-label"
              >
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Upload className="h-5 w-5" />
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onUpload}
                  data-testid="image-upload-input"
                />
              </label>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Upload JPG/PNG/WEBP. Saved to backend/uploads. First image is the primary.
            </p>
          </div>

          <DialogFooter className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full text-sm font-medium hover:bg-muted"
              data-testid="pf-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary !px-5 !py-2 text-sm"
              data-testid="pf-save"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                "Save"
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children, className = "" }) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs">{label}</Label>
      {children}
    </div>
  );
}
