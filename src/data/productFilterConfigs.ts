import type { ProductCategory } from '@/types/Product';

export type FilterType = 'checkbox' | 'color' | 'rating';

export type FilterOption = {
  value: string;
  label: string;
};

export type FilterConfig = {
  id: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
};

export type FilterState = {
  category?: ProductCategory;
  values: Record<string, string[]>;
  price: [number, number];
};

const commonFilters: FilterConfig[] = [
  {
    id: 'brand',
    label: 'برند',
    type: 'checkbox',
  },
  {
    id: 'colors',
    label: 'رنگ',
    type: 'color',
  },
  {
    id: 'rating',
    label: 'امتیاز',
    type: 'rating',
    options: [
      {
        value: '4.5',
        label: '۴.۵ و بالاتر',
      },
      {
        value: '4',
        label: '۴ و بالاتر',
      },
      {
        value: '3',
        label: '۳ و بالاتر',
      },
    ],
  },
  {
    id: 'availability',
    label: 'موجودی',
    type: 'checkbox',
    options: [
      {
        value: 'available',
        label: 'فقط کالاهای موجود',
      },
    ],
  },
];

const categoryFilters: Partial<Record<ProductCategory, FilterConfig[]>> = {
  mobile: [
    {
      id: 'specifications.ram',
      label: 'حافظه RAM',
      type: 'checkbox',
      options: [
        { value: '8GB', label: '۸ گیگابایت' },
        { value: '12GB', label: '۱۲ گیگابایت' },
        { value: '16GB', label: '۱۶ گیگابایت' },
      ],
    },
    {
      id: 'specifications.storage',
      label: 'حافظه داخلی',
      type: 'checkbox',
      options: [
        { value: '128GB', label: '۱۲۸ گیگابایت' },
        { value: '256GB', label: '۲۵۶ گیگابایت' },
        { value: '512GB', label: '۵۱۲ گیگابایت' },
        { value: '1TB', label: '۱ ترابایت' },
      ],
    },
    {
      id: 'specifications.operatingSystem',
      label: 'سیستم‌عامل',
      type: 'checkbox',
      options: [
        { value: 'Android', label: 'Android' },
        { value: 'iOS', label: 'iOS' },
      ],
    },
  ],

  laptop: [
    {
      id: 'specifications.ram',
      label: 'حافظه RAM',
      type: 'checkbox',
      options: [
        { value: '8GB', label: '۸ گیگابایت' },
        { value: '16GB', label: '۱۶ گیگابایت' },
        { value: '32GB', label: '۳۲ گیگابایت' },
      ],
    },
    {
      id: 'specifications.storage',
      label: 'حافظه داخلی',
      type: 'checkbox',
      options: [
        { value: '256GB', label: '۲۵۶ گیگابایت' },
        { value: '512GB', label: '۵۱۲ گیگابایت' },
        { value: '1TB', label: '۱ ترابایت' },
      ],
    },
    {
      id: 'specifications.operatingSystem',
      label: 'سیستم‌عامل',
      type: 'checkbox',
      options: [
        { value: 'Windows', label: 'Windows' },
        { value: 'macOS', label: 'macOS' },
      ],
    },
    {
      id: 'specifications.usageType',
      label: 'نوع کاربری',
      type: 'checkbox',
      options: [
        { value: 'عمومی', label: 'عمومی' },
        { value: 'گیمینگ', label: 'گیمینگ' },
      ],
    },
  ],

  headphone: [
    {
      id: 'specifications.connectionType',
      label: 'نوع اتصال',
      type: 'checkbox',
      options: [
        { value: 'Bluetooth', label: 'بلوتوث' },
        { value: 'Wired', label: 'سیمی' },
      ],
    },
    {
      id: 'specifications.noiseCancellation',
      label: 'حذف نویز',
      type: 'checkbox',
      options: [{ value: 'true', label: 'دارای حذف نویز' }],
    },
    {
      id: 'specifications.microphone',
      label: 'میکروفون',
      type: 'checkbox',
      options: [{ value: 'true', label: 'دارای میکروفون' }],
    },
  ],

  smartwatch: [
    {
      id: 'specifications.operatingSystem',
      label: 'سیستم‌عامل',
      type: 'checkbox',
      options: [
        { value: 'watchOS', label: 'watchOS' },
        { value: 'Wear OS', label: 'Wear OS' },
      ],
    },
  ],

  camera: [
    {
      id: 'specifications.resolution',
      label: 'رزولوشن',
      type: 'checkbox',
      options: [{ value: '4K', label: '4K' }],
    },
  ],

  gaming: [],

  accessories: [
    {
      id: 'specifications.connectionType',
      label: 'نوع اتصال',
      type: 'checkbox',
      options: [
        { value: 'Bluetooth', label: 'بلوتوث' },
        { value: 'Wired', label: 'سیمی' },
      ],
    },
  ],

  home: [],
};

export function getFilterConfigs(category?: ProductCategory): FilterConfig[] {
  const specificFilters = category ? (categoryFilters[category] ?? []) : [];

  return [...commonFilters, ...specificFilters];
}
