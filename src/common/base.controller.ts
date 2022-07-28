import 'reflect-metadata';
import { injectable } from 'inversify';
import { Response, Router } from 'express';
import { ILogger } from '../services/logger.interface';
import { IRoute } from './route.interface';

@injectable()
export abstract class BaseController {
  public readonly router: Router;

  constructor(private logger: ILogger) {
    this.router = Router();
  }

  protected bindRoutes(routes: IRoute[]): void {
    routes.forEach((route) => {
      // this.logger.log(`[${route.method}] ${route.path}`);
      const middlewares = route.middlewares?.map((m) => m.execute.bind(m));
      const handler = route.func.bind(this);
      const pipeline = middlewares ? [...middlewares, handler] : handler;
      this.router[route.method](route.path, pipeline);
    });
  }

  public sendOk<T>(res: Response, message?: T): void {
    this.send(res, 200, message ?? 'OK');
  }

  public sendCreated<T>(res: Response, message: T): void {
    this.send(res, 201, message);
  }

  public sendNoContent(res: Response): void {
    this.send(res, 204, null);
  }

  public send<T>(res: Response, code: number, message: T): void {
    res.status(code).json(message);
  }
}
