import { describe, it, expect } from "vitest";
import {
  sanitizeString,
  validateImageUrl,
  validatePrice,
  validateStock,
  ALLOWED_CATEGORIES,
} from "../validation";

describe("sanitizeString", () => {
  it("trims whitespace from both ends", () => {
    expect(sanitizeString("  hello  ")).toBe("hello");
  });

  it("truncates strings exceeding maxLength", () => {
    const long = "a".repeat(600);
    const result = sanitizeString(long);
    expect(result).toHaveLength(500);
  });

  it("truncates to a custom maxLength", () => {
    const result = sanitizeString("abcdefghij", 5);
    expect(result).toBe("abcde");
  });

  it("returns empty string for null", () => {
    expect(sanitizeString(null)).toBe("");
  });

  it("returns empty string for empty string", () => {
    expect(sanitizeString("")).toBe("");
  });

  it("trims before truncating", () => {
    // "   ab" after trim is "ab" (length 2), well within maxLength of 3
    expect(sanitizeString("   ab", 3)).toBe("ab");
  });

  it("returns the original string when within limits", () => {
    expect(sanitizeString("valid input")).toBe("valid input");
  });
});

describe("validatePrice", () => {
  it("accepts a valid price string", () => {
    expect(validatePrice("29.99")).toBe(2999);
  });

  it("accepts zero", () => {
    expect(validatePrice("0")).toBe(0);
  });

  it("accepts the upper boundary 999999", () => {
    expect(validatePrice("999999")).toBe(99999900);
  });

  it("rounds to two decimal places", () => {
    expect(validatePrice("19.999")).toBe(2000);
  });

  it("defaults null to 0", () => {
    expect(validatePrice(null)).toBe(0);
  });

  it("rejects negative prices", () => {
    expect(() => validatePrice("-1")).toThrow("Invalid price");
  });

  it("rejects prices above 999999", () => {
    expect(() => validatePrice("1000000")).toThrow("Invalid price");
  });

  it("rejects non-numeric strings", () => {
    expect(() => validatePrice("abc")).toThrow("Invalid price");
  });
});

describe("validateStock", () => {
  it("accepts a valid stock string", () => {
    expect(validateStock("50")).toBe(50);
  });

  it("accepts zero", () => {
    expect(validateStock("0")).toBe(0);
  });

  it("accepts the upper boundary 999999", () => {
    expect(validateStock("999999")).toBe(999999);
  });

  it("defaults null to 100", () => {
    expect(validateStock(null)).toBe(100);
  });

  it("rejects negative stock", () => {
    expect(() => validateStock("-1")).toThrow("Invalid stock value.");
  });

  it("rejects stock above 999999", () => {
    expect(() => validateStock("1000000")).toThrow("Invalid stock value.");
  });

  it("rejects non-numeric strings", () => {
    expect(() => validateStock("abc")).toThrow("Invalid stock value.");
  });
});

describe("validateImageUrl", () => {
  it("accepts relative paths starting with /", () => {
    expect(validateImageUrl("/products/jacket.png")).toBe(
      "/products/jacket.png"
    );
  });

  it("accepts https URLs", () => {
    expect(validateImageUrl("https://cdn.example.com/img.jpg")).toBe(
      "https://cdn.example.com/img.jpg"
    );
  });

  it("returns default image for null", () => {
    expect(validateImageUrl(null)).toBe("/products/default.png");
  });

  it("returns default image for empty string", () => {
    expect(validateImageUrl("")).toBe("/products/default.png");
  });

  it("rejects http URLs (non-secure)", () => {
    expect(() => validateImageUrl("http://example.com/img.jpg")).toThrow(
      "Image URL must be a relative path or HTTPS URL."
    );
  });

  it("rejects javascript: protocol", () => {
    expect(() => validateImageUrl("javascript:alert(1)")).toThrow(
      "Image URL must be a relative path or HTTPS URL."
    );
  });

  it("rejects data: URLs", () => {
    expect(() => validateImageUrl("data:image/png;base64,abc")).toThrow(
      "Image URL must be a relative path or HTTPS URL."
    );
  });

  it("rejects ftp: URLs", () => {
    expect(() => validateImageUrl("ftp://files.example.com/img.png")).toThrow(
      "Image URL must be a relative path or HTTPS URL."
    );
  });

  it("trims whitespace before validating", () => {
    expect(validateImageUrl("  /products/trimmed.png  ")).toBe(
      "/products/trimmed.png"
    );
  });
});

describe("ALLOWED_CATEGORIES", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(ALLOWED_CATEGORIES)).toBe(true);
    expect(ALLOWED_CATEGORIES.length).toBeGreaterThan(0);
  });

  it("contains expected categories", () => {
    expect(ALLOWED_CATEGORIES).toContain("Outerwear");
    expect(ALLOWED_CATEGORIES).toContain("Tops");
    expect(ALLOWED_CATEGORIES).toContain("Bottoms");
    expect(ALLOWED_CATEGORIES).toContain("Footwear");
    expect(ALLOWED_CATEGORIES).toContain("Accessories");
  });

  it("contains all 9 categories", () => {
    expect(ALLOWED_CATEGORIES).toHaveLength(9);
  });

  it("includes specialty categories", () => {
    expect(ALLOWED_CATEGORIES).toContain("EXO-WEAR");
    expect(ALLOWED_CATEGORIES).toContain("HARDWARE");
    expect(ALLOWED_CATEGORIES).toContain("ARCHIVE");
    expect(ALLOWED_CATEGORIES).toContain("Merch");
  });
});
