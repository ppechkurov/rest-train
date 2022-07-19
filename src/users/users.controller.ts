import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { LoggerService } from '../services/logger.service';

export class UsersController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger);
    this.bindRoutes([
      { path: '/login', method: 'get', func: this.login },
      { path: '/register', method: 'get', func: this.register },
    ]);
  }

  login(req: Request, res: Response, next: NextFunction): void {
    this.sendOk('login', res);
  }

  register(req: Request, res: Response, next: NextFunction): void {
    this.sendCreated('register', res);
  }
}