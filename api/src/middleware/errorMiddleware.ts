import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', error.message);
  res.status(500).json({ error: 'Internal server error' });
}

export function notFound(req: Request, res: Response): void {
  res.status(404).json({ error: 'Not found' });
}