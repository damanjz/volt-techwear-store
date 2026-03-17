import { prisma } from "@/lib/prisma";
import UserActions from "./UserActions";

export const dynamic = "force-dynamic";

export default async function AdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: { email: "asc" },
    include: {
      _count: { select: { orders: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-3xl uppercase tracking-tight">
          Users <span className="text-volt">.</span>
        </h1>
        <p className="font-mono text-xs text-white/40 uppercase tracking-widest mt-1">
          // Operative Registry
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">Email</th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">Role</th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">Clearance</th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">Volt Points</th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">Orders</th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">Status</th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono text-sm text-white/90">{user.email || "—"}</td>
                <td className="p-4">
                  <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded ${
                    user.role === "ADMIN" ? "bg-volt/10 text-volt" : "bg-white/10 text-white/50"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 font-mono text-xs text-white/70">LVL {user.clearanceLevel}</td>
                <td className="p-4 font-mono text-xs text-volt">{user.voltPoints.toLocaleString()}</td>
                <td className="p-4 font-mono text-xs text-white/50">{user._count.orders}</td>
                <td className="p-4">
                  <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded ${
                    user.isBanned ? "bg-cyber-red/10 text-cyber-red" : "bg-green-400/10 text-green-400"
                  }`}>
                    {user.isBanned ? "Banned" : "Active"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <UserActions user={user} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
