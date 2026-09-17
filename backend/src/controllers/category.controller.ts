import type { Request, Response } from 'express';

import { prisma } from '../config/database.js';

import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../validators/category.validator.js';

export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
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

export async function getCategoryById(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: 'شناسه نامعتبر است',
      });
    }

    const category = await prisma.category.findUnique({
      where: {
        id,
      },

      include: {
        products: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: 'دسته بندی پیدا نشد',
      });
    }

    return res.json({
      category,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}

export async function createCategory(
  req: Request<unknown, unknown, CreateCategoryInput>,
  res: Response,
) {
  try {
    const { name, slug } = req.body;

    const exists = await prisma.category.findUnique({
      where: {
        slug,
      },
    });

    if (exists) {
      return res.status(400).json({
        message: 'این slug قبلا وجود دارد',
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    return res.status(201).json({
      message: 'دسته بندی ایجاد شد',
      category,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}

export async function updateCategory(
  req: Request<{ id: string }, unknown, UpdateCategoryInput>,
  res: Response,
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: 'شناسه نامعتبر است',
      });
    }

    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: 'دسته بندی پیدا نشد',
      });
    }

    const { name, slug } = req.body;

    if (slug !== undefined) {
      const duplicateSlug = await prisma.category.findUnique({
        where: {
          slug,
        },
      });

      if (duplicateSlug && duplicateSlug.id !== id) {
        return res.status(400).json({
          message: 'این slug قبلاً استفاده شده است',
        });
      }
    }

    const updated = await prisma.category.update({
      where: {
        id,
      },

      data: {
        ...(name !== undefined && {
          name,
        }),

        ...(slug !== undefined && {
          slug,
        }),
      },
    });

    return res.json({
      message: 'دسته بندی بروزرسانی شد',
      category: updated,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}

export async function deleteCategory(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: 'شناسه نامعتبر است',
      });
    }

    const category = await prisma.category.findUnique({
      where: {
        id,
      },

      include: {
        products: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: 'دسته بندی پیدا نشد',
      });
    }

    if (category.products.length > 0) {
      return res.status(400).json({
        message: 'این دسته بندی دارای محصول است و قابل حذف نیست',
      });
    }

    await prisma.category.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: 'دسته بندی حذف شد',
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'خطای سرور',
    });
  }
}
