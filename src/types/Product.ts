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
  name: string;
  value: string;
};

export type ProductSpecifications = {
  ram?: string;
  storage?: string;
  cpu?: string;
  gpu?: string;
  screenSize?: number;
  resolution?: string;
  battery?: number;
  operatingSystem?: string;
  connectionType?: string;
  bluetooth?: boolean;
  noiseCancellation?: boolean;
  microphone?: boolean;
  refreshRate?: number;
  panelType?: string;
  hdr?: boolean;
  camera?: string;
  usageType?: string;
};

export type Product = {
  id: number;
  title: string;
  image: string;

  price: number;
  discountPrice?: number;
  discount?: number;

  rating: number;
  reviewCount: number;

  description?: string;

  category: ProductCategory;
  brand: string;

  colors: ProductColor[];

  stock: number;

  isNew?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;

  specifications?: ProductSpecifications;
};
