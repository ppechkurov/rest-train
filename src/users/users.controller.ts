import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller.js';
import { TYPES } from '../types.js';
import { ILogger } from '../services/logger.interface.js';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http-error.class.js';

@injectable()
export class UsersController extends BaseController {
  constructor(@inject(TYPES.ILogger) logger: ILogger) {
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
    throw new HttpError(400, 'authorization error', req.originalUrl);
  }
}
