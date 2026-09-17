import type { Response } from 'express';

import { prisma } from '../config/database.js';

import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export async function createPayment(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'احراز نشده',
      });
    }

    const orderId = Number(req.params.orderId);

    console.log({
      params: req.params,
      orderId,
      userId: req.user,
    });

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: 'سفارش پیدا نشد',
      });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({
        message: 'این سفارش قابل پرداخت نیست',
      });
    }

    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.finalPrice,
      },
    });

    return res.json({
      message: 'درگاه پرداخت ایجاد شد',

      paymentUrl: `http://fake-payment.com/pay/${payment.id}`,

      payment,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}

export async function verifyPayment(req: AuthenticatedRequest, res: Response) {
  try {
    const paymentId = Number(req.params.id);

    if (!Number.isInteger(paymentId)) {
      return res.status(400).json({
        message: 'شناسه پرداخت نامعتبر است',
      });
    }

    const payment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },

      include: {
        order: true,
      },
    });

    if (!payment) {
      return res.status(404).json({
        message: 'پرداخت پیدا نشد',
      });
    }

    if (payment.status === 'SUCCESS') {
      return res.status(400).json({
        message: 'این پرداخت قبلاً تایید شده است',
      });
    }

    await prisma.$transaction(async (tx) => {
      const items = await tx.orderItem.findMany({
        where: {
          orderId: payment.orderId,
        },
      });

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: {
            id: item.productId,
          },
        });

        if (!product) {
          throw new Error('محصول پیدا نشد');
        }

        if (product.stock < item.quantity) {
          throw new Error(`موجودی محصول ${product.title} کافی نیست`);
        }

        await tx.product.update({
          where: {
            id: item.productId,
          },

          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.payment.update({
        where: {
          id: paymentId,
        },

        data: {
          status: 'SUCCESS',
          transactionId: req.body.transactionId,
        },
      });

      await tx.order.update({
        where: {
          id: payment.orderId,
        },

        data: {
          status: 'PROCESSING',
        },
      });
    });

    return res.json({
      message: 'پرداخت موفق بود',
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error instanceof Error ? error.message : 'خطای سرور',
    });
  }
}
