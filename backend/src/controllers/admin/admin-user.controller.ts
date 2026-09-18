import type { Request, Response } from 'express';

import { prisma } from '../../config/database.js';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware.js';

export async function getAllUsers(_req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json({
      users,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        message: 'شناسه کاربر نامعتبر است',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,

        orders: {
          select: {
            id: true,
            status: true,
            finalPrice: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: 'کاربر پیدا نشد',
      });
    }

    return res.json({
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}

export async function updateUserRole(req: Request, res: Response) {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        message: 'شناسه کاربر نامعتبر است',
      });
    }

    const { role } = req.body;

    const userExists = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userExists) {
      return res.status(404).json({
        message: 'کاربر پیدا نشد',
      });
    }

    const currentUserId = (req as AuthenticatedRequest).user?.id;

    if (
      currentUserId === userId &&
      userExists.role === 'ADMIN' &&
      role === 'USER'
    ) {
      return res.status(400).json({
        message: 'نمی‌توانید دسترسی ادمین خودتان را حذف کنید',
      });
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        role,
      },

      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    return res.json({
      message: 'نقش کاربر تغییر کرد',

      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}
