import { Router } from 'express';
import { authRequired, AuthRequest } from '../middleware/auth';
import { Post } from '../models/Post';

const router = Router();

router.get('/', async (_req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 }).limit(50);
  res.json({ posts });
});

router.post('/', authRequired, async (req: AuthRequest, res) => {
  const { title, content, tags, attachments } = req.body;
  const post = await Post.create({
    authorId: req.userId!,
    title,
    content,
    tags: tags ?? [],
    attachments: attachments ?? []
  });
  res.json({ post });
});

export default router;


