import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Request, Response } from 'express';
import multer from 'multer';

const uploadDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../uploads',
);
fs.mkdirSync(uploadDirectory, { recursive: true });

export const imageUpload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (_request, file, callback) => {
      callback(
        null,
        `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`,
      );
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    callback(null, file.mimetype.startsWith('image/'));
  },
});

export function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ message: 'فایل تصویر ارسال نشده است' });
  }

  const baseUrl =
    process.env.PUBLIC_API_URL ??
    `http://localhost:${process.env.PORT ?? 5000}`;

  return res.status(201).json({
    url: `${baseUrl}/uploads/${req.file.filename}`,
  });
}
