import type { Request, Response } from 'express';

import type {
  CreateProductInput,
  UpdateProductInput,
} from '../validators/product.validator.js';

import { prisma } from '../config/database.js';
import type { Prisma } from '../generated/prisma/client.js';

export async function createProduct(
  req: Request<unknown, unknown, CreateProductInput>,
  res: Response,
) {
  try {
    const {
      title,
      slug,
      description,
      brand,
      price,
      discountPrice,
      discount,
      rating,
      reviewCount,
      stock,
      isNew,
      isPopular,
      isFeatured,
      categoryId,
      specifications,
      image,
      colors,
    } = req.body;

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return res.status(400).json({
        message: 'دسته‌بندی پیدا نشد',
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        slug,
      },
    });

    if (existingProduct) {
      return res.status(400).json({
        message: 'محصولی با این slug قبلاً وجود دارد',
      });
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug,

        ...(description !== undefined && {
          description,
        }),

        brand,

        price,

        ...(discountPrice !== undefined && {
          discountPrice,
        }),

        ...(discount !== undefined && {
          discount,
        }),

        rating,
        reviewCount,
        stock,

        isNew,
        isPopular,
        isFeatured,

        categoryId,

        ...(specifications !== undefined && {
          specifications: specifications as Prisma.InputJsonValue,
        }),

        ...(image
          ? {
              images: {
                create: [
                  {
                    url: image,
                  },
                ],
              },
            }
          : {}),

        colors: {
          create: colors.map((color) => ({
            name: color.name,
            value: color.value,
          })),
        },
      },
    });

    return res.status(201).json({
      message: 'محصول با موفقیت ایجاد شد',
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}

export async function updateProduct(
  req: Request<{ id: string }, unknown, UpdateProductInput>,
  res: Response,
) {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId)) {
      return res.status(400).json({
        message: 'شناسه محصول نامعتبر است',
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: 'محصول پیدا نشد',
      });
    }

    const {
      title,
      slug,
      description,
      brand,
      price,
      discountPrice,
      discount,
      rating,
      reviewCount,
      stock,
      isNew,
      isPopular,
      isFeatured,
      categoryId,
      specifications,
      // image,
      // colors,
    } = req.body;

    if (categoryId !== undefined) {
      const category = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });

      if (!category) {
        return res.status(400).json({
          message: 'دسته‌بندی پیدا نشد',
        });
      }
    }

    if (slug !== undefined) {
      const productWithSlug = await prisma.product.findUnique({
        where: {
          slug,
        },
      });

      if (productWithSlug && productWithSlug.id !== productId) {
        return res.status(400).json({
          message: 'محصول دیگری با این slug وجود دارد',
        });
      }
    }

    const product = await prisma.product.update({
      where: {
        id: productId,
      },

      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(brand !== undefined && { brand }),

        ...(price !== undefined && { price }),
        ...(discountPrice !== undefined && { discountPrice }),
        ...(discount !== undefined && { discount }),

        ...(rating !== undefined && { rating }),
        ...(reviewCount !== undefined && { reviewCount }),

        ...(stock !== undefined && { stock }),

        ...(isNew !== undefined && { isNew }),
        ...(isPopular !== undefined && { isPopular }),
        ...(isFeatured !== undefined && { isFeatured }),

        ...(categoryId !== undefined && {
          categoryId,
        }),

        ...(specifications !== undefined && {
          specifications: specifications as Prisma.InputJsonValue,
        }),
      },
    });

    return res.json({
      message: 'محصول با موفقیت بروزرسانی شد',
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId)) {
      return res.status(400).json({
        message: 'شناسه محصول نامعتبر است',
      });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: 'محصول پیدا نشد',
      });
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return res.json({
      message: 'محصول با موفقیت حذف شد',
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}
