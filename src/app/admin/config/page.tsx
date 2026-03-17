import { prisma } from "@/lib/prisma";
import ConfigEditor from "./ConfigEditor";

export const dynamic = "force-dynamic";

export default async function AdminConfig() {
  const configs = await prisma.siteConfig.findMany({
    orderBy: { key: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-black text-3xl uppercase tracking-tight">
          Site Config <span className="text-volt">.</span>
        </h1>
        <p className="font-mono text-xs text-white/40 uppercase tracking-widest mt-1">
          // Feature Flags & Global Settings
        </p>
      </div>

      <ConfigEditor configs={configs} />
    </div>
  );
}
