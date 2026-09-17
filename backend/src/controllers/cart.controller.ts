import type { Request, Response } from 'express';

import { prisma } from '../config/database.js';

import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export async function getCart(req: Request, res: Response) {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'کاربر احراز نشده است',
      });
    }

    let cart = await prisma.cart.findUnique({
      where: {
        userId,
      },

      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },

        include: {
          items: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      });
    }

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    const totalPrice = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const finalPrice = cart.items.reduce((sum, item) => {
      const price = item.product.discountPrice ?? item.product.price;

      return sum + price * item.quantity;
    }, 0);

    const totalDiscount = totalPrice - finalPrice;

    return res.json({
      cart: {
        ...cart,

        summary: {
          totalItems,
          totalPrice,
          totalDiscount,
          finalPrice,
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

export async function addToCart(req: Request, res: Response) {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;

    const { productId, quantity } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: 'احراز نشده',
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

    if (product.stock < quantity) {
      return res.status(400).json({
        message: 'تعداد درخواستی بیشتر از موجودی محصول است',
      });
    }

    let cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
      });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    let item;

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          message: 'تعداد نهایی بیشتر از موجودی محصول است',
        });
      }

      item = await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },

        data: {
          quantity: newQuantity,
        },
      });
    } else {
      item = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return res.status(201).json({
      message: 'محصول به سبد اضافه شد',
      item,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}

export async function updateCartItem(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'کاربر احراز نشده است',
      });
    }

    const itemId = Number(req.params.id);

    if (!Number.isInteger(itemId)) {
      return res.status(400).json({
        message: 'شناسه آیتم نامعتبر است',
      });
    }

    const { quantity } = req.body;

    const item = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId,
        },
      },
    });

    if (!item) {
      return res.status(404).json({
        message: 'آیتم در سبد خرید پیدا نشد',
      });
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id: itemId,
      },

      data: {
        quantity,
      },
    });

    return res.json({
      message: 'تعداد محصول بروزرسانی شد',
      item: updatedItem,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}

export async function deleteCartItem(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'کاربر احراز نشده است',
      });
    }

    const itemId = Number(req.params.id);

    if (!Number.isInteger(itemId)) {
      return res.status(400).json({
        message: 'شناسه آیتم نامعتبر است',
      });
    }

    const item = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId,
        },
      },
    });

    if (!item) {
      return res.status(404).json({
        message: 'آیتم پیدا نشد',
      });
    }

    await prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    });

    return res.json({
      message: 'محصول از سبد حذف شد',
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}

export async function clearCart(req: Request, res: Response) {
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
    });

    if (!cart) {
      return res.status(404).json({
        message: 'سبد خرید پیدا نشد',
      });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return res.json({
      message: 'سبد خرید با موفقیت خالی شد',
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}
