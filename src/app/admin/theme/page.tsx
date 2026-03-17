import { prisma } from "@/lib/prisma";
import ThemeEditor from "./ThemeEditor";

export const dynamic = "force-dynamic";

const THEME_KEYS = [
  { key: "theme.volt", label: "Volt (Primary Accent)", defaultValue: "#d4ff33" },
  { key: "theme.cyber-red", label: "Cyber Red (CTA/Alert)", defaultValue: "#ff1a4f" },
  { key: "theme.background", label: "Background", defaultValue: "#0a0a0a" },
  { key: "theme.foreground", label: "Foreground Text", defaultValue: "#ffffff" },
];

export default async function AdminTheme() {
  const configs = await prisma.siteConfig.findMany({
    where: { key: { startsWith: "theme." } },
  });

  const configMap: Record<string, string> = {};
  for (const c of configs) {
    configMap[c.key] = c.value;
  }

  const themeValues = THEME_KEYS.map((tk) => ({
    ...tk,
    currentValue: configMap[tk.key] || tk.defaultValue,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-black text-3xl uppercase tracking-tight">
          Theme Control <span className="text-volt">.</span>
        </h1>
        <p className="font-mono text-xs text-white/40 uppercase tracking-widest mt-1">
          // Live Design Token Editor
        </p>
        <p className="font-mono text-xs text-white/20 mt-3">
          Changes apply instantly across the entire storefront without redeployment.
        </p>
      </div>

      <ThemeEditor themeValues={themeValues} />
    </div>
  );
}
