import { describe, it, expect } from "vitest";
import {
  CLEARANCE_TIERS,
  VOLT_POINTS_RATE,
  CLEARANCE_THRESHOLDS,
} from "../constants";

describe("CLEARANCE_TIERS", () => {
  it("has exactly two tiers", () => {
    expect(CLEARANCE_TIERS).toHaveLength(2);
  });

  it("tier 1 entry has level 2, cost 500, and correct label", () => {
    expect(CLEARANCE_TIERS[0]).toEqual({
      level: 2,
      cost: 500,
      label: "Tier 2 — Field Operative",
    });
  });

  it("tier 2 entry has level 3, cost 2000, and correct label", () => {
    expect(CLEARANCE_TIERS[1]).toEqual({
      level: 3,
      cost: 2000,
      label: "Tier 3 — Black Site Access",
    });
  });

  it("tiers are ordered by ascending level", () => {
    for (let i = 1; i < CLEARANCE_TIERS.length; i++) {
      expect(CLEARANCE_TIERS[i]!.level).toBeGreaterThan(
        CLEARANCE_TIERS[i - 1]!.level
      );
    }
  });

  it("tiers have ascending costs", () => {
    for (let i = 1; i < CLEARANCE_TIERS.length; i++) {
      expect(CLEARANCE_TIERS[i]!.cost).toBeGreaterThan(
        CLEARANCE_TIERS[i - 1]!.cost
      );
    }
  });
});

describe("VOLT_POINTS_RATE", () => {
  it("is 0.1 (10%)", () => {
    expect(VOLT_POINTS_RATE).toBe(0.1);
  });

  it("is a number", () => {
    expect(typeof VOLT_POINTS_RATE).toBe("number");
  });
});

describe("CLEARANCE_THRESHOLDS", () => {
  it("tier2 threshold is 5000", () => {
    expect(CLEARANCE_THRESHOLDS.tier2).toBe(5000);
  });

  it("tier3 threshold is 15000", () => {
    expect(CLEARANCE_THRESHOLDS.tier3).toBe(15000);
  });

  it("tier3 threshold is higher than tier2", () => {
    expect(CLEARANCE_THRESHOLDS.tier3).toBeGreaterThan(
      CLEARANCE_THRESHOLDS.tier2
    );
  });

  it("has exactly two threshold keys", () => {
    expect(Object.keys(CLEARANCE_THRESHOLDS)).toHaveLength(2);
  });
});
