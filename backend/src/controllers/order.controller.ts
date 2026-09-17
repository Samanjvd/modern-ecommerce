import type { Request, Response } from 'express';

import { prisma } from '../config/database.js';

import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

import type { CreateOrderInput } from '../validators/order.validator.js';

export async function getMyOrders(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'کاربر احراز نشده است',
      });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: {
                  take: 1,
                },
              },
            },
          },
        },
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

export async function getUserOrderById(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'کاربر احراز نشده است',
      });
    }

    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({
        message: 'شناسه سفارش نامعتبر است',
      });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },

      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        message: 'سفارش پیدا نشد',
      });
    }

    return res.json({
      order,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}

export async function createOrder(
  req: Request<unknown, unknown, CreateOrderInput>,
  res: Response,
) {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'کاربر احراز نشده است',
      });
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: 'سبد خرید خالی است',
      });
    }

    let totalPrice = 0;

    let totalDiscount = 0;

    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          message: `موجودی محصول ${item.product.title} کافی نیست`,
        });
      }

      const price = item.product.discountPrice ?? item.product.price;

      totalPrice += item.product.price * item.quantity;

      totalDiscount += (item.product.price - price) * item.quantity;
    }

    const finalPrice = totalPrice - totalDiscount;

    const order = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,

          firstName: req.body.firstName,

          lastName: req.body.lastName,

          phone: req.body.phone,

          address: req.body.address,

          city: req.body.city,

          postalCode: req.body.postalCode,

          totalPrice,

          totalDiscount,

          finalPrice,

          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,

              quantity: item.quantity,

              price: item.product.discountPrice ?? item.product.price,
            })),
          },
        },

        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  images: {
                    take: 1,
                  },
                },
              },
            },
          },
        },
      });

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return order;
    });

    return res.status(201).json({
      message: 'سفارش با موفقیت ثبت شد',

      order,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}
