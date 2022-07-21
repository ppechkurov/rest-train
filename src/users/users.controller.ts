import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HttpError } from '../errors/http-error.class';
import { LoggerService } from '../services/logger.service';

export class UsersController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger);
    this.bindRoutes([
      { path: '/login', method: 'get', func: this.login },
      { path: '/register', method: 'post', func: this.register },
    ]);
  }

  login(req: Request, res: Response, next: NextFunction): void {
    this.sendOk(res);
  }

  register(req: Request, res: Response, next: NextFunction): void {
    // this.sendCreated('register', res);
    throw new HttpError(400, 'error registering user', req.originalUrl);
  }
}
