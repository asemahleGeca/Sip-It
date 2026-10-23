import type { Database } from "./database";

export type ShippingAddress = {
  full_name: string;
  email: string;
  address: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
};

export type OrderStatus =
  Database["public"]["Tables"]["orders"]["Row"]["status"];

export type Order = Omit<
  Database["public"]["Tables"]["orders"]["Row"],
  "shipping_address"
> & {
  shipping_address: ShippingAddress;
};

export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];

export type OrderWithItems = Order & {
  items: OrderItem[];
};
