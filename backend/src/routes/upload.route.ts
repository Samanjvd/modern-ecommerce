import { Router } from 'express';

import { uploadImage, imageUpload } from '../controllers/upload.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/image', authenticate, imageUpload.single('file'), uploadImage);

export default router;
