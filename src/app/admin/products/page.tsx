import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, AlertTriangle } from "lucide-react";
import ProductActions from "./ProductActions";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      price: true,
      category: true,
      imageUrl: true,
      isActive: true,
      isClassified: true,
      stock: true,
      createdAt: true,
      _count: { select: { orderItems: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl uppercase tracking-tight">
            Products <span className="text-volt">.</span>
          </h1>
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest mt-1">
            // Inventory Management
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-volt text-black font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-volt/80 transition-colors font-bold"
        >
          <Plus size={14} />
          New Product
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">
                Product
              </th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">
                Category
              </th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">
                Price
              </th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">
                Stock
              </th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">
                Status
              </th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">
                Sales
              </th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-right p-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-mono text-sm text-white/90">
                        {product.name}
                      </p>
                      {product.isClassified && (
                        <span className="font-mono text-[9px] text-cyber-red uppercase tracking-widest">
                          Classified
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4 font-mono text-xs text-white/50">
                  {product.category}
                </td>
                <td className="p-4 font-mono text-xs text-green-400">
                  ${(product.price / 100).toFixed(2)}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-xs ${
                        product.stock <= 10
                          ? "text-cyber-red"
                          : product.stock <= 25
                          ? "text-yellow-400"
                          : "text-white/70"
                      }`}
                    >
                      {product.stock}
                    </span>
                    {product.stock <= 10 && (
                      <AlertTriangle size={12} className="text-cyber-red" />
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded ${
                      product.isActive
                        ? "bg-green-400/10 text-green-400"
                        : "bg-white/10 text-white/30"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-4 font-mono text-xs text-white/50">
                  {product._count.orderItems}
                </td>
                <td className="p-4 text-right">
                  <ProductActions product={product} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
