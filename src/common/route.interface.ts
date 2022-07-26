import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from './middleware.interface.js';

export interface IRoute {
  path: string;
  func: (req: Request, res: Response, next: NextFunction) => void;
  method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
  middlewares?: IMiddleware[];
}
