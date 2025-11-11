import { Router } from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User';
import { signToken } from '../middleware/auth';

const router = Router();

// Local signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  const token = signToken(user.id);
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
  res.json({ user });
});

// Local login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) return res.status(400).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
  const token = signToken(user.id);
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
  res.json({ user });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

// Passport Google Strategy setup
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: process.env.GOOGLE_CALLBACK_URL as string
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName || 'User';
      let user = await User.findOne({ googleId: profile.id });
      if (!user && email) {
        user = await User.findOne({ email });
      }
      if (!user) {
        user = await User.create({
          name,
          email: email ?? `${profile.id}@google.local`,
          googleId: profile.id,
          avatarUrl: profile.photos?.[0]?.value ?? ''
        });
      } else if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
      return done(null, user);
    } catch (e) {
      return done(e as any, undefined);
    }
  }
));

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/auth?error=google` }),
  (req: any, res) => {
    const token = signToken(req.user.id);
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
    res.redirect(`${process.env.CLIENT_URL}/`);
  }
);

export default router;


