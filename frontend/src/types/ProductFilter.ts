import type { ProductCategory } from './Product';

export type ProductFilterType = 'checkbox' | 'radio' | 'range' | 'color';

export type ProductFilterOption = {
  value: string;
  label: string;
};

export type ProductFilterConfig = {
  id: string;
  label: string;
  type: ProductFilterType;
  category?: ProductCategory;
  options?: ProductFilterOption[];
};

export type ProductFilterState = {
  category?: ProductCategory;
  brands: string[];
  colors: string[];
  ratings: number[];
  minPrice?: number;
  maxPrice?: number;
  availability: boolean;

  ram: string[];
  storage: string[];
  operatingSystem: string[];
  screenSize: string[];

  cpu: string[];
  gpu: string[];
  usageType: string[];

  connectionType: string[];
  bluetooth: boolean;
  noiseCancellation: boolean;
  microphone: boolean;

  panelType: string[];
  resolution: string[];
  refreshRate: number[];
  hdr: boolean;

  camera: string[];
};
