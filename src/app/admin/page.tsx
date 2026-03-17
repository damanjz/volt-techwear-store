import { prisma } from "@/lib/prisma";
import {
  Package,
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  const [productCount, userCount, orderCount, revenue, lowStock, recentOrders] =
    await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.product.count({ where: { stock: { lte: 10 }, isActive: true } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { email: true } }, items: true },
      }),
    ]);

  return {
    productCount,
    userCount,
    orderCount,
    revenue: revenue._sum.total || 0,
    lowStock,
    recentOrders,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${stats.revenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Orders",
      value: stats.orderCount,
      icon: ShoppingCart,
      color: "text-volt",
      bg: "bg-volt/10",
    },
    {
      label: "Products",
      value: stats.productCount,
      icon: Package,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Users",
      value: stats.userCount,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Low Stock Alerts",
      value: stats.lowStock,
      icon: AlertTriangle,
      color: "text-cyber-red",
      bg: "bg-cyber-red/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-black text-3xl uppercase tracking-tight">
          Command Center <span className="text-volt">.</span>
        </h1>
        <p className="font-mono text-xs text-white/40 uppercase tracking-widest mt-1">
          // System Overview
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                  {card.label}
                </span>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <Icon size={14} className={card.color} />
                </div>
              </div>
              <p className={`font-display font-black text-2xl ${card.color}`}>
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-volt" />
            <h2 className="font-display font-bold text-lg uppercase tracking-tight">
              Recent Orders
            </h2>
          </div>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="font-mono text-sm text-white/30 text-center py-8">
            No orders yet
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left pb-3">
                  Order ID
                </th>
                <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left pb-3">
                  User
                </th>
                <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left pb-3">
                  Items
                </th>
                <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left pb-3">
                  Total
                </th>
                <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left pb-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order: any) => (
                <tr
                  key={order.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 font-mono text-xs text-white/70">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="py-3 font-mono text-xs text-white/70">
                    {order.user?.email || "Unknown"}
                  </td>
                  <td className="py-3 font-mono text-xs text-white/50">
                    {order.items.length} items
                  </td>
                  <td className="py-3 font-mono text-xs text-green-400">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded ${
                        order.status === "PAID"
                          ? "bg-green-400/10 text-green-400"
                          : order.status === "SHIPPED"
                          ? "bg-blue-400/10 text-blue-400"
                          : "bg-yellow-400/10 text-yellow-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
