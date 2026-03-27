import { describe, it, expect } from "vitest";
import * as adminActions from "../index";

describe("Admin Actions Index", () => {
  it("exports all expected components", () => {
    // validation
    expect(adminActions.sanitizeString).toBeDefined();
    expect(adminActions.validatePrice).toBeDefined();
    expect(adminActions.validateStock).toBeDefined();
    expect(adminActions.validateImageUrl).toBeDefined();
    expect(adminActions.ALLOWED_CATEGORIES).toBeDefined();

    // products
    expect(adminActions.createProduct).toBeDefined();
    expect(adminActions.updateProduct).toBeDefined();
    expect(adminActions.deleteProduct).toBeDefined();
    expect(adminActions.toggleProductActive).toBeDefined();
    expect(adminActions.bulkUpdateProducts).toBeDefined();

    // users
    expect(adminActions.updateUserRole).toBeDefined();
    expect(adminActions.updateUserPoints).toBeDefined();
    expect(adminActions.updateUserClearance).toBeDefined();
    expect(adminActions.toggleUserBan).toBeDefined();

    // orders
    expect(adminActions.createCoupon).toBeDefined();
    expect(adminActions.deleteCoupon).toBeDefined();
    expect(adminActions.toggleCouponActive).toBeDefined();
    expect(adminActions.validateCoupon).toBeDefined();
    expect(adminActions.upsertConfig).toBeDefined();
    expect(adminActions.getConfigs).toBeDefined();
  });
});
