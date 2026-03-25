export interface CartItemInput {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

export function validateCartItems(items: CartItemInput[]): void {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty.");
  }
  if (items.length > 50) {
    throw new Error("Too many items in cart.");
  }
  for (const item of items) {
    if (!item.id || typeof item.id !== "string") {
      throw new Error("Invalid item in cart.");
    }
    if (typeof item.quantity !== "number" || item.quantity < 1 || item.quantity > 99) {
      throw new Error(`Invalid quantity for ${item.name || "item"}.`);
    }
    if (typeof item.price !== "number" || item.price < 0) {
      throw new Error(`Invalid price for ${item.name || "item"}.`);
    }
  }
}
