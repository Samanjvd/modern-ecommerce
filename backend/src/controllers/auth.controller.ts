import type { Request, Response } from 'express';

import { prisma } from '../config/database.js';
import { comparePassword, hashPassword } from '../utils/hash.js';
import { createToken } from '../utils/jwt.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'این ایمیل قبلا ثبت شده است',
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = createToken({
      id: user.id,
      role: user.role,
    });

    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: 'کاربر پیدا نشد',
      });
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        message: 'رمز عبور اشتباه است',
      });
    }

    const token = createToken({
      id: user.id,
      role: user.role,
    });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'کاربر احراز هویت نشده است',
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
        role: true,
        phone: true,
        avatar: true,
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
