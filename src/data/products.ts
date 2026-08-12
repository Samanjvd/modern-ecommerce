import type { Product } from '@/types/Product';

export const products: Product[] = [
  {
    id: 1,
    title: 'گوشی موبایل سامسونگ Galaxy S24 Ultra',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx4cCivoV13eXvo0Mgxhp4BzdIJOrmeIkz1UIQKoAdWQ&s',
    price: 69900000,
    discountPrice: 64900000,
    discount: 7,
    rating: 4.8,
    reviewCount: 128,
    category: 'موبایل',
    stock: 12,
  },
  {
    id: 2,
    title: 'لپ تاپ ASUS Vivobook 15',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx4cCivoV13eXvo0Mgxhp4BzdIJOrmeIkz1UIQKoAdWQ&s',
    price: 48900000,
    discountPrice: 45900000,
    discount: 6,
    rating: 4.6,
    reviewCount: 84,
    category: 'لپ تاپ',
    stock: 7,
  },
  {
    id: 3,
    title: 'هدفون بی‌سیم Sony WH-1000XM5',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx4cCivoV13eXvo0Mgxhp4BzdIJOrmeIkz1UIQKoAdWQ&s',
    price: 18900000,
    rating: 4.9,
    reviewCount: 213,
    category: 'هدفون',
    stock: 20,
  },
  {
    id: 4,
    title: 'هدفون بی‌سیم Sony WH-1000XM5',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx4cCivoV13eXvo0Mgxhp4BzdIJOrmeIkz1UIQKoAdWQ&s',
    price: 18900000,
    rating: 4.9,
    reviewCount: 513,
    category: 'هدفون',
    stock: 0,
  },
];
