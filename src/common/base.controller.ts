import { Response, Router } from 'express';
import { LoggerService } from '../services/logger.service';
import { IRoute } from './route.interface';

export abstract class BaseController {
  private readonly router: Router;

  constructor(private logger: LoggerService) {
    this.router = Router();
  }

  protected bindRoutes(routes: IRoute[]) {
    routes.forEach((route) => {
      this.logger.log(`[${route.method} ${route.path}]`);
      this.router[route.method](route.path, route.func.bind(this));
    });
  }

  public sendOk<T>(message: T, res: Response) {
    return this.send(200, message, res);
  }

  public sendCreated<T>(message: T, res: Response) {
    return this.send(201, message, res);
  }

  public sendNoContent(res: Response) {
    return this.send(204, null, res);
  }

  public send<T>(code: number, message: T, res: Response) {
    return res.status(code).json(message);
  }
}
