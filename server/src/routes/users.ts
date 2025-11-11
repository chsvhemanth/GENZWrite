import { Router } from 'express';
import { authRequired, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

const router = Router();

router.get('/', authRequired, async (_req, res) => {
  console.log('[USERS] GET /');
  const users = await User.find().limit(100);
  res.json({ users });
});

router.get('/me', authRequired, async (req: AuthRequest, res) => {
  console.log('[USERS] GET /me userId:', req.userId);
  const user = await User.findById(req.userId);
  res.json({ user });
});

router.put('/me', authRequired, async (req: AuthRequest, res) => {
  console.log('[USERS] PUT /me userId:', req.userId, 'body:', req.body);
  const updates = (({ name, bio, avatarUrl }) => ({ name, bio, avatarUrl }))(req.body);
  const user = await User.findByIdAndUpdate(req.userId, updates, { new: true });
  res.json({ user });
});

router.get('/:id', authRequired, async (req, res) => {
  console.log('[USERS] GET /:id', req.params.id);
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

router.post('/:id/follow', authRequired, async (req: AuthRequest, res) => {
  const targetId = req.params.id;
  const currentId = req.userId!;
  if (currentId === targetId) {
    return res.status(400).json({ message: 'Cannot follow yourself' });
  }
  const currentUser = await User.findById(currentId);
  const targetUser = await User.findById(targetId);
  if (!currentUser || !targetUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  const isFollowing = currentUser.following.includes(targetId);
  if (isFollowing) {
    currentUser.following = currentUser.following.filter((id) => id !== targetId);
    targetUser.followers = targetUser.followers.filter((id) => id !== currentId);
  } else {
    currentUser.following.push(targetId);
    targetUser.followers.push(currentId);
  }
  await currentUser.save();
  await targetUser.save();
  res.json({ current: currentUser, target: targetUser });
});

export default router;


