import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller.js';
import { TYPES } from '../types.js';
import { ILogger } from '../services/logger.interface.js';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http-error.class.js';
import { IUsersController } from './users.controller.interface.js';
import { UserLoginDto } from '../dto/user-login.dto.js';
import { UserRegisterDto } from '../dto/user-register.dto.js';
import { User } from './user.entity.js';

@injectable()
export class UsersController extends BaseController implements IUsersController {
  constructor(@inject(TYPES.ILogger) logger: ILogger) {
    super(logger);
    this.bindRoutes([
      { path: '/login', method: 'get', func: this.login },
      { path: '/register', method: 'post', func: this.register },
    ]);
  }

  login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
    console.log(req.body);
    this.sendOk(res);
  }

  async register(
    { body }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { name, email, password } = body;
    const user = new User(name, email);
    await user.setPassword(password);

    this.sendCreated(user, res);
  }
}
