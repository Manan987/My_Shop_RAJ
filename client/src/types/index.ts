export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  originalPrice: string | null;
  categoryId: number | null;
  imageUrl: string | null;
  sizes: string[] | null;
  colors: string[] | null;
  stock: number | null;
  featured: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date | null;
}

export interface CartItem {
  id: number;
  userId: string;
  productId: number;
  quantity: number;
  size: string | null;
  color: string | null;
  createdAt: Date | null;
  product: Product;
}

export interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  isAdmin: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Order {
  id: number;
  userId: string;
  total: string;
  status: string | null;
  shippingAddress: any;
  createdAt: Date | null;
  updatedAt: Date | null;
}
