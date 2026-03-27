"use client";

import { Package } from "lucide-react";

interface OrderItem {
  readonly name: string;
}

interface Order {
  readonly id: string;
  readonly status: string;
  readonly total: number;
  readonly createdAt: string | Date;
  readonly items: readonly OrderItem[];
}

interface OrderHistoryProps {
  readonly orders: readonly Order[];
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
  return (
    <div className="bg-background/40 backdrop-blur-sm border border-white/10 p-8">
      <div className="flex items-center gap-3 mb-6">
        <Package className="text-foreground/80" />
        <h3 className="font-display font-bold text-xl uppercase tracking-widest">Acquisition Log</h3>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="font-mono text-xs text-foreground/40 italic">No historical data found for this operative.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border border-white/5 bg-black/50 p-4 flex justify-between items-center">
              <div>
                <div className="font-mono text-[10px] text-volt mb-1">REQ_ID: #{order.id.slice(-8).toUpperCase()}</div>
                <div className="font-sans font-medium">
                  {order.items.map((i) => i.name).join(", ")}
                </div>
                <div className="font-mono text-xs text-foreground/50 mt-1">
                  Status: {order.status} // {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="font-mono font-bold">${(order.total / 100).toFixed(2)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
