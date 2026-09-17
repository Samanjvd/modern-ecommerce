import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { prisma } from '../config/database.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export async function getMe(req: Request, res: Response) {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'کاربر احراز نشده است',
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

export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'کاربر احراز نشده است',
      });
    }

    const { name, phone, avatar } = req.body;

    const user = await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(avatar !== undefined && { avatar }),
      },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
      },
    });

    return res.json({
      message: 'اطلاعات کاربر بروزرسانی شد',
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'کاربر احراز نشده است',
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: 'کاربر پیدا نشد',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'رمز عبور فعلی اشتباه است',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        password: hashedPassword,
      },
    });

    return res.json({
      message: 'رمز عبور تغییر کرد',
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}
