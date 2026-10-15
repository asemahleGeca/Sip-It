export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  sizes: string[];
  stock: number;
};

export type CartLine = {
  product: Product;
  size: string;
  quantity: number;
};
