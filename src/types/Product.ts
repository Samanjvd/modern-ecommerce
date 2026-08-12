export type Product = {
  id: number;
  title: string;
  image: string;
  price: number;
  discountPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  category: string;
  stock: number;
};
