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

export type OrderTracking = Pick<
  Database["public"]["Tables"]["orders"]["Row"],
  "id" | "order_number" | "status" | "total" | "created_at"
>;

export type OrderWithItems = Order & {
  items: OrderItem[];
};

export function formatOrderNumber(orderNumber: number) {
  return `RI-${orderNumber.toString().padStart(6, "0")}`;
}

export function parseOrderNumber(value: string): number | null {
  const match = /^(?:RI-)?(\d{1,18})$/i.exec(value.trim());
  if (!match) return null;

  const orderNumber = Number(match[1]);
  return Number.isSafeInteger(orderNumber) && orderNumber > 0 ? orderNumber : null;
}
