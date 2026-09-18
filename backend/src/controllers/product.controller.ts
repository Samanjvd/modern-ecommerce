import type { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { mapProduct } from '../utils/product.mapper.js';
import { productQuerySchema } from '../validators/product-query.validator.js';
import type { Prisma } from '../generated/prisma/client.js';

export async function getProducts(req: Request, res: Response) {
  try {
    const query = productQuerySchema.parse(req.query);

    const {
      page,
      limit,
      search,
      category,
      brands,
      minPrice,
      maxPrice,
      rating,
      availability,
      sort,
      ram,
      storage,
      cpu,
      operatingSystem,
      connectionType,
      bluetooth,
      noiseCancellation,
      microphone,
    } = query;

    const skip = (page - 1) * limit;

    const priceFilter =
      minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && {
                gte: minPrice,
              }),

              ...(maxPrice !== undefined && {
                lte: maxPrice,
              }),
            },
          }
        : {};

    const specificationConditions = [];

    if (ram) {
      specificationConditions.push({
        specifications: {
          path: ['ram'],
          equals: ram,
        },
      });
    }

    if (storage) {
      specificationConditions.push({
        specifications: {
          path: ['storage'],
          equals: storage,
        },
      });
    }

    if (cpu) {
      specificationConditions.push({
        specifications: {
          path: ['cpu'],
          equals: cpu,
        },
      });
    }

    if (operatingSystem) {
      specificationConditions.push({
        specifications: {
          path: ['operatingSystem'],
          equals: operatingSystem,
        },
      });
    }

    if (connectionType) {
      specificationConditions.push({
        specifications: {
          path: ['connectionType'],
          equals: connectionType,
        },
      });
    }

    if (bluetooth !== undefined) {
      specificationConditions.push({
        specifications: {
          path: ['bluetooth'],
          equals: bluetooth,
        },
      });
    }

    if (noiseCancellation !== undefined) {
      specificationConditions.push({
        specifications: {
          path: ['noiseCancellation'],
          equals: noiseCancellation,
        },
      });
    }

    if (microphone !== undefined) {
      specificationConditions.push({
        specifications: {
          path: ['microphone'],
          equals: microphone,
        },
      });
    }

    const where = {
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
          {
            brand: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),

      ...(category && {
        category: {
          slug: category,
        },
      }),

      ...(brands && {
        brand: {
          in: brands.split(',').map((item) => item.trim()),
        },
      }),

      ...priceFilter,

      ...(rating !== undefined && {
        rating: {
          gte: rating,
        },
      }),

      ...(availability === true && {
        stock: {
          gt: 0,
        },
      }),

      ...(specificationConditions.length > 0 && {
        AND: specificationConditions,
      }),
    };

    let orderBy: Prisma.ProductOrderByWithRelationInput = {
      createdAt: 'desc',
    };

    switch (sort) {
      case 'price_asc':
        orderBy = {
          price: 'asc',
        };
        break;

      case 'price_desc':
        orderBy = {
          price: 'desc',
        };
        break;

      case 'popular':
        orderBy = {
          reviewCount: 'desc',
        };
        break;

      default:
        orderBy = {
          createdAt: 'desc',
        };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,

        skip,

        take: limit,

        orderBy,

        include: {
          category: true,
          images: true,
          colors: true,
        },
      }),

      prisma.product.count({
        where,
      }),
    ]);

    return res.json({
      products,

      pagination: {
        page,

        limit,

        total,

        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}

export async function getProductById(req: Request, res: Response) {
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
      include: {
        category: true,
        images: true,
        colors: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        message: 'محصول پیدا نشد',
      });
    }

    return res.json({
      product: mapProduct(product),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}
