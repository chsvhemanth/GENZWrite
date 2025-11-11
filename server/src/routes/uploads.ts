import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authRequired } from '../middleware/auth';

const router = Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/', authRequired, upload.single('image'), (req, res) => {
  console.log('[UPLOADS] POST / file:', req.file?.originalname, 'storedAs:', req.file?.filename, 'userId:', (req as any).userId);
  const fileUrl = `/uploads/${req.file?.filename}`;
  res.json({ url: fileUrl });
});

export default router;


