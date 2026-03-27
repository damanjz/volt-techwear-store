import { describe, it, expect } from "vitest";
import * as actions from "../index";

describe("Actions Index", () => {
  it("exports all expected actions", () => {
    expect(actions.validateCartItems).toBeDefined();
    expect(actions.createOrder).toBeDefined();
    expect(actions.upgradeClearance).toBeDefined();
    expect(actions.CLEARANCE_TIERS).toBeDefined();
    expect(actions.VOLT_POINTS_RATE).toBeDefined();
    expect(actions.CLEARANCE_THRESHOLDS).toBeDefined();
  });
});
