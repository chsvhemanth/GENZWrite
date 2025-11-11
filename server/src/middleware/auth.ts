import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authRequired = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token || (req.headers.authorization?.split(' ')[1] ?? '');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { sub: string };
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const signToken = (userId: string) => {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
};


