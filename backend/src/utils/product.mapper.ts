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
    description: product.description,

    image: product.images[0]?.url ?? '',

    price: product.price,
    discountPrice: product.discountPrice,
    discount: product.discount,

    rating: product.rating,
    reviewCount: product.reviewCount,

    category: product.category.slug,

    brand: product.brand,

    colors: product.colors.map((color) => ({
      name: color.name,
      value: color.value,
    })),

    stock: product.stock,

    isNew: product.isNew,
    isPopular: product.isPopular,
    isFeatured: product.isFeatured,

    specifications: product.specifications,
  };
}
