import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import type { Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const uploadDirectory = process.env.VERCEL
  ? path.resolve('/tmp/zanbilak-uploads')
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    callback(null, file.mimetype.startsWith('image/'));
  },
});

const hasCloudinaryConfig = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );

async function uploadToCloudinary(file: Express.Multer.File) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'zanbilak' },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error ?? new Error('Cloudinary upload failed'));
          return;
        }
        resolve(result.secure_url);
      },
    );
    Readable.from(file.buffer).pipe(stream);
  });
}

async function uploadToLocal(file: Express.Multer.File) {
  const filename = `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`;
  await fs.promises.writeFile(path.join(uploadDirectory, filename), file.buffer);
  return `/uploads/${filename}`;
}

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ message: 'فایل تصویر ارسال نشده است' });
  }

  try {
    const url = hasCloudinaryConfig()
      ? await uploadToCloudinary(req.file)
      : `${process.env.PUBLIC_API_URL ?? `http://localhost:${process.env.PORT ?? 5000}`}${await uploadToLocal(req.file)}`;
    return res.status(201).json({ url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'آپلود تصویر انجام نشد' });
  }
}
