import type { Database } from "./database";

export type Product = Pick<
  Database["public"]["Tables"]["products"]["Row"],
  | "id"
  | "name"
  | "slug"
  | "description"
  | "price"
  | "image_url"
  | "category"
  | "sizes"
  | "stock"
>;

export type CartLine = {
  product: Product;
  size: string;
  quantity: number;
};
