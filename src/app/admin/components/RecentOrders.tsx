import { TrendingUp } from "lucide-react";

interface OrderItem {
  readonly id: string;
  readonly orderId: string;
  readonly productId: string;
  readonly name: string;
  readonly quantity: number;
  readonly price: number;
}

interface OrderUser {
  readonly email: string | null;
}

interface Order {
  readonly id: string;
  readonly userId: string;
  readonly total: number;
  readonly discount: number;
  readonly couponCode: string | null;
  readonly status: string;
  readonly createdAt: Date;
  readonly user: OrderUser | null;
  readonly items: readonly OrderItem[];
}

interface RecentOrdersProps {
  readonly orders: readonly Order[];
}

const TABLE_HEADERS = [
  "Order ID",
  "User",
  "Items",
  "Total",
  "Status",
] as const;

function getStatusStyle(status: string): string {
  switch (status) {
    case "PAID":
      return "bg-green-400/10 text-green-400";
    case "SHIPPED":
      return "bg-blue-400/10 text-blue-400";
    default:
      return "bg-yellow-400/10 text-yellow-400";
  }
}

function OrderRow({ order }: { readonly order: Order }) {
  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
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
          className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded ${getStatusStyle(order.status)}`}
        >
          {order.status}
        </span>
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <p className="font-mono text-sm text-white/30 text-center py-8">
      No orders yet
    </p>
  );
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-volt" />
          <h2 className="font-display font-bold text-lg uppercase tracking-tight">
            Recent Orders
          </h2>
        </div>
      </div>

      {orders.length === 0 ? (
        <EmptyState />
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header}
                  className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left pb-3"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
