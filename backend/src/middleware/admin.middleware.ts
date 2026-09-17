import type { NextFunction, Request, Response } from 'express';

import type { AuthenticatedRequest } from './auth.middleware.js';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as AuthenticatedRequest).user;

  if (!user) {
    return res.status(401).json({
      message: 'ابتدا وارد حساب شوید',
    });
  }

  if (user.role !== 'ADMIN') {
    return res.status(403).json({
      message: 'دسترسی ادمین ندارید',
    });
  }

  next();
}
