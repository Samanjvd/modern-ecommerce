import type { Request, Response } from 'express';

import { prisma } from '../config/database.js';

import type { UpdateOrderStatusInput } from '../validators/order.validator.js';

export async function getAllOrders(_req: Request, res: Response) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json({
      orders,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}

export async function updateOrderStatus(
  req: Request<{ id: string }, unknown, UpdateOrderStatusInput>,
  res: Response,
) {
  try {
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({
        message: 'شناسه سفارش نامعتبر است',
      });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: 'سفارش پیدا نشد',
      });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        status: req.body.status,
      },
    });

    return res.json({
      message: 'وضعیت سفارش بروزرسانی شد',

      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}
