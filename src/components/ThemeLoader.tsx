import { prisma } from "@/lib/prisma";

export default async function ThemeLoader() {
  let themeVars: Record<string, string> = {};

  try {
    const configs = await prisma.siteConfig.findMany({
      where: { key: { startsWith: "theme." } },
    });

    for (const config of configs) {
      const cssVar = config.key.replace("theme.", "--");
      themeVars[cssVar] = config.value;
    }
  } catch {
    // If DB is unavailable, fall back to defaults
  }

  if (Object.keys(themeVars).length === 0) return null;

  const cssString = Object.entries(themeVars)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n  ");

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `:root { ${cssString} }\n.dark { ${cssString} }`,
      }}
    />
  );
}
