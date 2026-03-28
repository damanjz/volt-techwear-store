/** Full product — matches Prisma Product model */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // cents
  category: string;
  imageUrl: string;
  isNew: boolean;
  stock: number;
  isActive: boolean;
  isClassified: boolean;
  tags: string; // comma-separated
  createdAt: string;
  updatedAt: string;
}

/** Subset for product listing grids — only fields rendered in cards */
export interface ProductListItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  isNew: boolean;
  tags: string;
}

/** Parse comma-separated tags string into array */
export function parseTags(tags: string): string[] {
  if (!tags) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

/** Format cents to dollar display string */
export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}
