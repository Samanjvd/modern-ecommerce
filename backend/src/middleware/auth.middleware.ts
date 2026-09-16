import 'dotenv/config';

import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

type AppJwtPayload = {
  id: number;
  role: 'USER' | 'ADMIN';
};

export type AuthenticatedRequest = Request & {
  user?: AppJwtPayload;
};

const JWT_SECRET: string = process.env.JWT_SECRET ?? '';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'توکن احراز هویت ارسال نشده است',
    });
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({
      message: 'فرمت توکن نامعتبر است',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      typeof decoded.id !== 'number' ||
      (decoded.role !== 'USER' && decoded.role !== 'ADMIN')
    ) {
      return res.status(401).json({
        message: 'توکن نامعتبر است',
      });
    }

    (req as AuthenticatedRequest).user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({
      message: 'توکن نامعتبر یا منقضی شده است',
    });
  }
}
