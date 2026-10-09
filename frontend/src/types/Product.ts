export type ProductCategory =
  | 'mobile'
  | 'laptop'
  | 'headphone'
  | 'smartwatch'
  | 'camera'
  | 'accessories'
  | 'gaming'
  | 'home';

export type ProductColor = {
  id: number;
  name: string;
  value: string;
  productId: number;
};

export type ProductImage = {
  id: number;
  url: string;
  productId: number;
};

export type ProductCategoryInfo = {
  id: number;
  name: string;
  slug: ProductCategory;
  createdAt: string;
  updatedAt: string;
};

export type ProductSpecifications = {
  cpu?: string;
  ram?: string;
  battery?: number;
  storage?: string;
  resolution?: string;
  screenSize?: number;
  operatingSystem?: string;

  bluetooth?: boolean;
  microphone?: boolean;
  connectionType?: string;
  noiseCancellation?: boolean;

  [key: string]: string | number | boolean | undefined;
};

export type Product = {
  id: number;
  title: string;
  slug: string;
  description: string | null;

  brand: string;

  price: number;
  discountPrice: number | null;
  discount: number | null;

  rating: number;
  reviewCount: number;

  stock: number;

  isNew: boolean;
  isPopular: boolean;
  isFeatured: boolean;

  specifications: ProductSpecifications | null;

  categoryId: number;
  category: ProductCategoryInfo;

  createdAt: string;
  updatedAt: string;

  images: ProductImage[];
  colors: ProductColor[];
};

export type ProductsResponse = {
  products: Product[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
