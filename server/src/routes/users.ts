import { Router } from 'express';
import { authRequired, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

const router = Router();

router.get('/me', authRequired, async (req: AuthRequest, res) => {
  const user = await User.findById(req.userId);
  res.json({ user });
});

router.put('/me', authRequired, async (req: AuthRequest, res) => {
  const updates = (({ name, bio, avatarUrl }) => ({ name, bio, avatarUrl }))(req.body);
  const user = await User.findByIdAndUpdate(req.userId, updates, { new: true });
  res.json({ user });
});

export default router;


