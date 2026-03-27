"use client";

import { toggleProductActive, deleteProduct } from "@/lib/admin-actions";
import { Power, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/components/TerminalToast";
import type { Product } from "@prisma/client";

export default function ProductActions({ product }: { product: Pick<Product, "id" | "name" | "isActive"> }) {
  const router = useRouter();
  const { addToast } = useToastStore();

  const handleToggle = async () => {
    try {
      await toggleProductActive(product.id);
      router.refresh();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to toggle product";
      addToast(`[ADMIN_ERR]: ${msg}`, "alert");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(product.id);
      router.refresh();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to delete product";
      addToast(`[ADMIN_ERR]: ${msg}`, "alert");
    }
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      <Link
        href={`/admin/products/${product.id}`}
        className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
        title="Edit"
      >
        <Pencil size={14} />
      </Link>
      <button
        onClick={handleToggle}
        className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${
          product.isActive
            ? "text-green-400 hover:text-yellow-400"
            : "text-white/30 hover:text-green-400"
        }`}
        title={product.isActive ? "Deactivate" : "Activate"}
      >
        <Power size={14} />
      </button>
      <button
        onClick={handleDelete}
        className="p-2 rounded-lg hover:bg-cyber-red/10 text-white/30 hover:text-cyber-red transition-colors"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
