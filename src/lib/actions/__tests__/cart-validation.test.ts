import { describe, it, expect } from "vitest";
import { validateCartItems, CartItemInput } from "../cart-validation";

const validItem: CartItemInput = {
  id: "prod-001",
  name: "Tactical Jacket",
  price: 299.99,
  quantity: 2,
  size: "M",
};

describe("validateCartItems", () => {
  it("accepts a valid cart with one item", () => {
    expect(() => validateCartItems([validItem])).not.toThrow();
  });

  it("accepts a valid cart with multiple items", () => {
    const items: CartItemInput[] = [
      validItem,
      { id: "prod-002", name: "Cargo Pants", price: 149.99, quantity: 1 },
    ];
    expect(() => validateCartItems(items)).not.toThrow();
  });

  it("accepts quantity of exactly 1", () => {
    expect(() =>
      validateCartItems([{ ...validItem, quantity: 1 }])
    ).not.toThrow();
  });

  it("accepts quantity of exactly 99", () => {
    expect(() =>
      validateCartItems([{ ...validItem, quantity: 99 }])
    ).not.toThrow();
  });

  it("accepts price of 0", () => {
    expect(() =>
      validateCartItems([{ ...validItem, price: 0 }])
    ).not.toThrow();
  });

  it("rejects an empty array", () => {
    expect(() => validateCartItems([])).toThrow("Cart is empty.");
  });

  it("rejects a non-array value", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => validateCartItems(null as any)).toThrow("Cart is empty.");
  });

  it("rejects items with quantity less than 1 (zero)", () => {
    expect(() =>
      validateCartItems([{ ...validItem, quantity: 0 }])
    ).toThrow("Invalid quantity");
  });

  it("rejects items with negative quantity", () => {
    expect(() =>
      validateCartItems([{ ...validItem, quantity: -1 }])
    ).toThrow("Invalid quantity");
  });

  it("rejects items with quantity greater than 99", () => {
    expect(() =>
      validateCartItems([{ ...validItem, quantity: 100 }])
    ).toThrow("Invalid quantity");
  });

  it("rejects items with non-numeric quantity", () => {
    expect(() =>
      validateCartItems([{ ...validItem, quantity: "two" as unknown as number }])
    ).toThrow("Invalid quantity");
  });

  it("rejects items with negative price", () => {
    expect(() =>
      validateCartItems([{ ...validItem, price: -10 }])
    ).toThrow("Invalid price");
  });

  it("rejects items with missing id", () => {
    expect(() =>
      validateCartItems([{ ...validItem, id: "" }])
    ).toThrow("Invalid item in cart.");
  });

  it("rejects items with non-string id", () => {
    expect(() =>
      validateCartItems([{ ...validItem, id: 123 as unknown as string }])
    ).toThrow("Invalid item in cart.");
  });

  it("rejects more than 50 items", () => {
    const items = Array.from({ length: 51 }, (_, i) => ({
      ...validItem,
      id: `prod-${i}`,
    }));
    expect(() => validateCartItems(items)).toThrow("Too many items in cart.");
  });

  it("includes item name in quantity error message", () => {
    expect(() =>
      validateCartItems([{ ...validItem, name: "Night Ops Vest", quantity: 0 }])
    ).toThrow("Invalid quantity for Night Ops Vest.");
  });

  it("falls back to 'item' when name is missing in error message", () => {
    expect(() =>
      validateCartItems([{ ...validItem, name: "", quantity: 0 }])
    ).toThrow("Invalid quantity for item.");
  });
});
