import { Router } from 'express';
import { authRequired, AuthRequest } from '../middleware/auth';
import { Post } from '../models/Post';

const router = Router();

router.get('/', authRequired, async (req, res) => {
  console.log('[POSTS] GET / posts');
  const posts = await Post.find().sort({ createdAt: -1 }).limit(50);
  res.json({ posts });
});

router.post('/', authRequired, async (req: AuthRequest, res) => {
  console.log('[POSTS] POST / body:', req.body, 'userId:', req.userId);
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


