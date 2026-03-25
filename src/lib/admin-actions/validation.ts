export function sanitizeString(value: string | null, maxLength: number = 500): string {
  if (!value) return "";
  return value.trim().slice(0, maxLength);
}

export function validateImageUrl(raw: string | null): string {
  const url = sanitizeString(raw, 500);
  if (!url) return "/products/default.png";
  if (url.startsWith("/") || url.startsWith("https://")) return url;
  throw new Error("Image URL must be a relative path or HTTPS URL.");
}

export function validatePrice(value: string | null): number {
  const price = parseFloat(value || "0");
  if (isNaN(price) || price < 0 || price > 999999) {
    throw new Error("Invalid price. Must be between 0 and 999,999.");
  }
  return Math.round(price * 100) / 100;
}

export function validateStock(value: string | null): number {
  const stock = parseInt(value || "100");
  if (isNaN(stock) || stock < 0 || stock > 999999) {
    throw new Error("Invalid stock value.");
  }
  return stock;
}

export const ALLOWED_CATEGORIES = ["Outerwear", "Tops", "Bottoms", "Footwear", "Accessories", "Merch", "EXO-WEAR", "HARDWARE", "ARCHIVE"];
