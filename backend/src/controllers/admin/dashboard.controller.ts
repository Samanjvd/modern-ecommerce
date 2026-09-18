import type { Request, Response } from 'express';

import { prisma } from '../../config/database.js';

export async function getDashboardStats(_req: Request, res: Response) {
  try {
    const [
      usersCount,
      productsCount,
      ordersCount,
      categoriesCount,
      sales,
      pendingOrders,
      lowStockProducts,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.product.count(),

      prisma.order.count(),

      prisma.category.count(),

      prisma.order.aggregate({
        _sum: {
          finalPrice: true,
        },

        where: {
          status: {
            in: ['PROCESSING', 'SHIPPED', 'DELIVERED'],
          },
        },
      }),

      prisma.order.count({
        where: {
          status: 'PENDING',
        },
      }),

      prisma.product.findMany({
        where: {
          stock: {
            lte: 5,
          },
        },

        select: {
          id: true,
          title: true,
          stock: true,
        },

        orderBy: {
          stock: 'asc',
        },

        take: 10,
      }),
    ]);

    return res.json({
      dashboard: {
        users: {
          total: usersCount,
        },

        products: {
          total: productsCount,
          lowStock: lowStockProducts,
        },

        categories: {
          total: categoriesCount,
        },

        orders: {
          total: ordersCount,
          pending: pendingOrders,
        },

        sales: {
          total: sales._sum.finalPrice ?? 0,
        },
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}
