import type { Request, Response } from 'express';

import { prisma } from '../config/database.js';

import type { CreateReviewInput } from '../validators/review.validator.js';

import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export async function createReview(
  req: Request<{ id: string }, unknown, CreateReviewInput>,
  res: Response,
) {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'احراز هویت نشده است',
      });
    }

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

    const purchased = await prisma.orderItem.findFirst({
      where: {
        productId,

        order: {
          userId,

          status: {
            in: ['PROCESSING', 'SHIPPED', 'DELIVERED'],
          },
        },
      },
    });

    if (!purchased) {
      return res.status(403).json({
        message: 'فقط خریداران این محصول می‌توانند نظر ثبت کنند',
      });
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId,
      },
    });

    if (existingReview) {
      return res.status(400).json({
        message: 'قبلاً برای این محصول نظر ثبت کرده‌اید',
      });
    }

    const review = await prisma.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: {
          comment: req.body.comment,
          rating: req.body.rating,

          userId,
          productId,
        },
      });

      const reviews = await tx.review.findMany({
        where: {
          productId,
        },

        select: {
          rating: true,
        },
      });

      const total = reviews.reduce((sum, item) => sum + item.rating, 0);

      const average = total / reviews.length;

      await tx.product.update({
        where: {
          id: productId,
        },

        data: {
          rating: Number(average.toFixed(1)),

          reviewCount: reviews.length,
        },
      });

      return newReview;
    });

    return res.status(201).json({
      message: 'نظر با موفقیت ثبت شد',

      review,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}
