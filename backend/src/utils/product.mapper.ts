import type { Prisma } from '../generated/prisma/client.js';

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    images: true;
    colors: true;
  };
}>;

export function mapProduct(product: ProductWithRelations) {
  return {
    id: product.id,
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
    categoryId: product.categoryId,
    category: product.category,
    images: product.images,
    colors: product.colors,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
