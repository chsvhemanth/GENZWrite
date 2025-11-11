import { NextFunction, Request, Response } from 'express';

export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  const start = Date.now();
  // eslint-disable-next-line no-console
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  (req as any)._reqStartAt = start;
  next();
};

export const notFoundHandler = (req: Request, res: Response) => {
  // eslint-disable-next-line no-console
  console.warn(`[404] ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Not Found' });
};

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  const duration = (Date.now() - ((req as any)._reqStartAt || Date.now()));
  const status = err.status || err.statusCode || 500;
  const bodyPreview = typeof req.body === 'object' ? JSON.stringify(req.body).slice(0, 500) : String(req.body);
  // eslint-disable-next-line no-console
  console.error(`[ERR] ${req.method} ${req.originalUrl} ${status} +${duration}ms`);
  // eslint-disable-next-line no-console
  console.error('Message:', err.message);
  if (err.stack) {
    // eslint-disable-next-line no-console
    console.error(err.stack);
  }
  // eslint-disable-next-line no-console
  console.error('Req headers:', JSON.stringify(req.headers));
  // eslint-disable-next-line no-console
  console.error('Req body:', bodyPreview);
  res.status(status).json({ message: err.message || 'Internal Server Error' });
};


