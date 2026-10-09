export type CartProductColor = {
  id: number;
  name: string;
  value: string;
  productId: number;
};

export type CartProduct = {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  discountPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  colors: CartProductColor[];
  stock: number;
  isNew: boolean;
  isPopular: boolean;
  isFeatured: boolean;
  specifications: Record<string, string | number | boolean>;
};

export type CartItem = {
  id: number;
  quantity: number;
  product: CartProduct;
  selectedColor?: CartProductColor;
};

export type CartSummary = {
  totalItems: number;
  totalPrice: number;
  totalDiscount: number;
  finalPrice: number;
};

export type Cart = {
  id: number;
  userId: number;
  items: CartItem[];
  summary: CartSummary;
};

export type CartResponse = {
  cart: Cart;
};
