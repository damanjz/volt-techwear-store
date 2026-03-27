import {
  Package,
  Users,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

interface StatCardData {
  readonly label: string;
  readonly value: string | number;
  readonly icon: LucideIcon;
  readonly color: string;
  readonly bg: string;
}

interface AdminStatsProps {
  readonly productCount: number;
  readonly userCount: number;
  readonly orderCount: number;
  readonly revenue: number;
  readonly lowStock: number;
}

function StatCard({ label, value, icon: Icon, color, bg }: StatCardData) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
          {label}
        </span>
        <div className={`p-2 rounded-lg ${bg}`}>
          <Icon size={14} className={color} />
        </div>
      </div>
      <p className={`font-display font-black text-2xl ${color}`}>{value}</p>
    </div>
  );
}

function buildStatCards(stats: AdminStatsProps): readonly StatCardData[] {
  return [
    {
      label: "Total Revenue",
      value: `$${(stats.revenue / 100).toFixed(2)}`,
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
  ] as const;
}

export default function AdminStats(props: AdminStatsProps) {
  const statCards = buildStatCards(props);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
