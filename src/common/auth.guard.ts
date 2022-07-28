import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/http-error.class';
import { IMiddleware } from './middleware.interface';

export class AuthGuard implements IMiddleware {
  execute(req: Request, res: Response, next: NextFunction): void {
    next(req.user ? undefined : new HttpError(401, 'unauthorized user'));
  }
}
