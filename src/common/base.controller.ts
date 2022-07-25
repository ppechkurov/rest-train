import 'reflect-metadata';
import { injectable } from 'inversify';
import { Response, Router } from 'express';
import { ILogger } from '../services/logger.interface.js';
import { IRoute } from './route.interface.js';

@injectable()
export abstract class BaseController {
  public readonly router: Router;

  constructor(private logger: ILogger) {
    this.router = Router();
  }

  protected bindRoutes(routes: IRoute[]): void {
    routes.forEach((route) => {
      this.logger.log(`[${route.method}] ${route.path}`);
      this.router[route.method](route.path, route.func.bind(this));
    });
  }

  public sendOk(res: Response): void {
    this.send(200, 'OK', res);
  }

  public sendCreated<T>(message: T, res: Response): void {
    this.send(201, message, res);
  }

  public sendNoContent(res: Response): void {
    this.send(204, null, res);
  }

  public send<T>(code: number, message: T, res: Response): void {
    res.status(code).json(message);
  }
}
