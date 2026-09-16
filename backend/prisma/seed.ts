import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const products = [
  {
    title: 'لپ تاپ Apple MacBook Air M2 13.6-inch',
    slug: 'macbook-air-m2-13-6',
    description: 'لپ تاپ Apple MacBook Air مجهز به پردازنده Apple M2',
    brand: 'Apple',
    price: 68_900_000,
    discountPrice: 64_900_000,
    discount: 6,
    rating: 4.9,
    reviewCount: 212,
    stock: 5,
    isNew: false,
    isPopular: true,
    isFeatured: true,
    categorySlug: 'laptop',

    specifications: {
      ram: '8GB',
      storage: '256GB',
      cpu: 'Apple M2',
      screenSize: 13.6,
      resolution: '2560×1664',
      battery: 52.6,
      operatingSystem: 'macOS',
    },

    image:
      'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=800&q=80',

    colors: [
      {
        name: 'نقره‌ای',
        value: '#C0C0C0',
      },
      {
        name: 'خاکستری',
        value: '#808080',
      },
    ],
  },

  {
    title: 'Apple iPhone 15 Pro',
    slug: 'iphone-15-pro',
    description: 'گوشی هوشمند Apple iPhone 15 Pro',
    brand: 'Apple',
    price: 89_900_000,
    discountPrice: 84_900_000,
    discount: 6,
    rating: 4.8,
    reviewCount: 184,
    stock: 8,
    isNew: true,
    isPopular: true,
    isFeatured: true,
    categorySlug: 'mobile',

    specifications: {
      ram: '8GB',
      storage: '256GB',
      cpu: 'Apple A17 Pro',
      screenSize: 6.1,
      resolution: '2556×1179',
      operatingSystem: 'iOS',
    },

    image:
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80',

    colors: [
      {
        name: 'تیتانیوم',
        value: '#6E6E6E',
      },
    ],
  },

  {
    title: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    description: 'هدفون بی‌سیم با قابلیت حذف نویز فعال',
    brand: 'Sony',
    price: 18_900_000,
    discountPrice: 16_900_000,
    discount: 11,
    rating: 4.8,
    reviewCount: 96,
    stock: 12,
    isNew: false,
    isPopular: true,
    isFeatured: false,
    categorySlug: 'headphone',

    specifications: {
      connectionType: 'Wireless',
      bluetooth: true,
      noiseCancellation: true,
      microphone: true,
      battery: 30,
    },

    image:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',

    colors: [
      {
        name: 'مشکی',
        value: '#111111',
      },
    ],
  },
] as const;

const categories = [
  {
    name: 'موبایل',
    slug: 'mobile',
  },
  {
    name: 'لپ تاپ',
    slug: 'laptop',
  },
  {
    name: 'هدفون',
    slug: 'headphone',
  },
  {
    name: 'ساعت هوشمند',
    slug: 'smartwatch',
  },
  {
    name: 'دوربین',
    slug: 'camera',
  },
  {
    name: 'لوازم جانبی',
    slug: 'accessories',
  },
  {
    name: 'گیمینگ',
    slug: 'gaming',
  },
  {
    name: 'خانه',
    slug: 'home',
  },
] as const;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const categoryMap = new Map<string, number>();

  // Seed categories
  for (const category of categories) {
    const result = await prisma.category.upsert({
      where: {
        slug: category.slug,
      },

      update: {
        name: category.name,
      },

      create: {
        name: category.name,
        slug: category.slug,
      },
    });

    categoryMap.set(result.slug, result.id);
  }

  // Seed products
  for (const product of products) {
    const categoryId = categoryMap.get(product.categorySlug);

    if (!categoryId) {
      throw new Error(`Category not found: ${product.categorySlug}`);
    }

    await prisma.product.upsert({
      where: {
        slug: product.slug,
      },

      update: {
        title: product.title,
        description: product.description,
        brand: product.brand,
        price: product.price,
        discountPrice: product.discountPrice,
        discount: product.discount,
        rating: product.rating,
        reviewCount: product.reviewCount,
        stock: product.stock,
        isNew: product.isNew,
        isPopular: product.isPopular,
        isFeatured: product.isFeatured,
        specifications: product.specifications,
        categoryId,
      },

      create: {
        title: product.title,
        slug: product.slug,
        description: product.description,
        brand: product.brand,
        price: product.price,
        discountPrice: product.discountPrice,
        discount: product.discount,
        rating: product.rating,
        reviewCount: product.reviewCount,
        stock: product.stock,
        isNew: product.isNew,
        isPopular: product.isPopular,
        isFeatured: product.isFeatured,
        specifications: product.specifications,
        categoryId,

        images: {
          create: [
            {
              url: product.image,
            },
          ],
        },

        colors: {
          create: product.colors.map((color) => ({
            name: color.name,
            value: color.value,
          })),
        },
      },
    });
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
