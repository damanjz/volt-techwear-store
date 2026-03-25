// Clearance upgrade tiers
export const CLEARANCE_TIERS = [
  { level: 2, cost: 500, label: "Tier 2 — Field Operative" },
  { level: 3, cost: 2000, label: "Tier 3 — Black Site Access" },
] as const;

// Volt Points reward rate (10% of order total)
export const VOLT_POINTS_RATE = 0.1;

// Auto-promotion thresholds
export const CLEARANCE_THRESHOLDS = {
  tier2: 5000,
  tier3: 15000,
} as const;
