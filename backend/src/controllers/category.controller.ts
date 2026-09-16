import type { Request, Response } from 'express';

import { prisma } from '../config/database.js';

export async function getCategories(_req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    return res.json({
      categories,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}
