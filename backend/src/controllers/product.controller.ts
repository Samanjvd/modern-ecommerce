import type { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { mapProduct } from '../utils/product.mapper.js';

export async function getProducts(_req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true,
        colors: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json({
      products: products.map(mapProduct),
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
