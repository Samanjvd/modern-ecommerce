import type { Request, Response } from 'express';

import { prisma } from '../config/database.js';

import { comparePassword, hashPassword } from '../utils/hash.js';

import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';

import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
} from '../utils/cookie.js';

const REFRESH_TOKEN_EXPIRES_IN_DAYS = 30;

function getRefreshTokenExpirationDate() {
  return new Date(
    Date.now() + REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
  );
}

async function saveRefreshToken(userId: number, token: string) {
  await prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  });

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt: getRefreshTokenExpirationDate(),
    },
  });
}

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

    const accessToken = createAccessToken({
      id: user.id,

      role: user.role,
    });

    const refreshToken = createRefreshToken({
      id: user.id,
    });

    await saveRefreshToken(user.id, refreshToken);

    setRefreshTokenCookie(res, refreshToken);

    return res.status(201).json({
      user: {
        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role,
      },

      accessToken,
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

    const validPassword = await comparePassword(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        message: 'رمز عبور اشتباه است',
      });
    }

    const accessToken = createAccessToken({
      id: user.id,

      role: user.role,
    });

    const refreshToken = createRefreshToken({
      id: user.id,
    });

    await saveRefreshToken(user.id, refreshToken);

    setRefreshTokenCookie(res, refreshToken);

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      accessToken,
    });
  } catch (error) {
    console.error(error);

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

export async function refreshToken(req: Request, res: Response) {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: 'Refresh token موجود نیست',
      });
    }

    const decoded = verifyRefreshToken(token);

    const storedToken = await prisma.refreshToken.findUnique({
      where: {
        token,
      },
    });

    if (!storedToken) {
      return res.status(401).json({
        message: 'Refresh token نامعتبر است',
      });
    }

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({
        where: {
          id: storedToken.id,
        },
      });

      return res.status(401).json({
        message: 'Refresh token منقضی شده است',
      });
    }

    if (storedToken.userId !== decoded.id) {
      return res.status(401).json({
        message: 'Refresh token نامعتبر است',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: 'کاربر پیدا نشد',
      });
    }

    await prisma.refreshToken.delete({
      where: {
        id: storedToken.id,
      },
    });

    const newAccessToken = createAccessToken({
      id: user.id,

      role: user.role,
    });

    const newRefreshToken = createRefreshToken({
      id: user.id,
    });

    await saveRefreshToken(user.id, newRefreshToken);

    setRefreshTokenCookie(res, newRefreshToken);

    return res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: 'Refresh token نامعتبر است',
    });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        message: 'Refresh token ارسال نشده است',
      });
    }

    await prisma.refreshToken.deleteMany({
      where: {
        token: refreshToken,
      },
    });

    clearRefreshTokenCookie(res);

    return res.json({
      message: 'با موفقیت خارج شدید',
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}
