"use client";

import { createProduct, updateProduct } from "@/lib/admin-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProductForm({ product }: { product?: any }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const isEditing = !!product;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    try {
      if (isEditing) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      alert("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { name: "name", label: "Product Name", type: "text", required: true, defaultValue: product?.name || "" },
    { name: "description", label: "Description", type: "textarea", required: true, defaultValue: product?.description || "" },
    { name: "price", label: "Price ($)", type: "number", required: true, defaultValue: product?.price || "" },
    { name: "category", label: "Category", type: "text", required: true, defaultValue: product?.category || "" },
    { name: "imageUrl", label: "Image URL", type: "text", required: true, defaultValue: product?.imageUrl || "/products/default.png" },
    { name: "stock", label: "Stock", type: "number", required: true, defaultValue: product?.stock ?? 100 },
    { name: "tags", label: "Tags (comma-separated)", type: "text", required: false, defaultValue: product?.tags || "" },
  ];

  const checkboxes = [
    { name: "isNew", label: "New Arrival", defaultValue: product?.isNew || false },
    { name: "isActive", label: "Active", defaultValue: product?.isActive ?? true },
    { name: "isClassified", label: "Classified (Black Site)", defaultValue: product?.isClassified || false },
  ];

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display font-black text-3xl uppercase tracking-tight">
            {isEditing ? "Edit" : "New"} Product <span className="text-volt">.</span>
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                defaultValue={field.defaultValue}
                required={field.required}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-white focus:border-volt focus:outline-none transition-colors resize-none"
              />
            ) : (
              <input
                name={field.name}
                type={field.type}
                defaultValue={field.defaultValue}
                required={field.required}
                step={field.type === "number" ? "0.01" : undefined}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-white focus:border-volt focus:outline-none transition-colors"
              />
            )}
          </div>
        ))}

        <div className="flex flex-wrap gap-6 pt-2">
          {checkboxes.map((cb) => (
            <label key={cb.name} className="flex items-center gap-2 cursor-pointer">
              <input
                type="hidden"
                name={cb.name}
                value="false"
              />
              <input
                type="checkbox"
                name={cb.name}
                value="true"
                defaultChecked={cb.defaultValue}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-volt focus:ring-volt"
              />
              <span className="font-mono text-xs text-white/70 uppercase tracking-widest">
                {cb.label}
              </span>
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-volt text-black font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-volt/80 transition-colors font-bold disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
}
