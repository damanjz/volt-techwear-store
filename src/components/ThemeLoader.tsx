import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

const getCachedTheme = unstable_cache(
  async () => {
    const configs = await prisma.siteConfig.findMany({
      where: { key: { startsWith: "theme." } },
    });
    return configs;
  },
  ["theme-config"],
  { revalidate: 300 }
);

// Strict CSS value validation to prevent CSS injection
const CSS_COLOR_REGEX = /^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[\d.]+\s*\)|[a-zA-Z]{1,30})$/;
const CSS_VAR_REGEX = /^--[a-zA-Z][a-zA-Z0-9-]*$/;

function sanitizeCssValue(value: string): string | null {
  const trimmed = value.trim();
  if (!CSS_COLOR_REGEX.test(trimmed)) return null;
  return trimmed;
}

function sanitizeCssVar(key: string): string | null {
  if (!CSS_VAR_REGEX.test(key)) return null;
  return key;
}

export default async function ThemeLoader() {
  const themeVars: Record<string, string> = {};

  try {
    const configs = await getCachedTheme();

    for (const config of configs) {
      const cssVar = sanitizeCssVar(config.key.replace("theme.", "--"));
      const cssValue = sanitizeCssValue(config.value);
      if (cssVar && cssValue) {
        themeVars[cssVar] = cssValue;
      }
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
