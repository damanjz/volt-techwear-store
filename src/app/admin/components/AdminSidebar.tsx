"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Ticket,
  Users,
  Palette,
  Settings,
  ArrowLeft,
  Shield,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/theme", label: "Theme", icon: Palette },
  { href: "/admin/config", label: "Config", icon: Settings },
];

export default function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#111111] border-r border-white/10 flex flex-col z-50">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={20} className="text-volt" />
          <span className="font-display font-black text-lg uppercase tracking-tight">
            VOLT <span className="text-volt">Admin</span>
          </span>
        </div>
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
          Control System v1.0
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-xs uppercase tracking-widest transition-all ${
                isActive
                  ? "bg-volt/10 text-volt border border-volt/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <div className="px-4 py-2">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
            Operative
          </p>
          <p className="font-mono text-xs text-white/70 truncate">
            {user?.email || "Unknown"}
          </p>
          <p className="font-mono text-[10px] text-volt uppercase tracking-widest mt-1">
            {user?.role || "USER"} // LVL {user?.clearanceLevel || 1}
          </p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 text-white/40 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Store
        </Link>
      </div>
    </aside>
  );
}
