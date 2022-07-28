import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IMiddleware } from './middleware.interface';
const { verify } = jwt;

export class AuthMiddleware implements IMiddleware {
  constructor(private jwtSecret: string) {}
  execute(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      verify(authHeader.split(' ')[1], this.jwtSecret, (err, payload) => {
        if (err) {
          next();
        } else if (payload) {
          req.user = (payload as JwtPayload).email;
          next();
        }
      });
    } else {
      next();
    }
  }
}
