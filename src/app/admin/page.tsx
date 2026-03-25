import { prisma } from "@/lib/prisma";
import AdminStats from "./components/AdminStats";
import RecentOrders from "./components/RecentOrders";

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
      <AdminStats
        productCount={stats.productCount}
        userCount={stats.userCount}
        orderCount={stats.orderCount}
        revenue={stats.revenue}
        lowStock={stats.lowStock}
      />

      {/* Recent Orders */}
      <RecentOrders orders={stats.recentOrders} />
    </div>
  );
}
