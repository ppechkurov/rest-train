import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller.js';
import { IUsersController } from './interfaces/users.controller.interface.js';
import { TYPES } from '../types.js';
import { ILogger } from '../services/logger.interface.js';
import { IUsersService } from './interfaces/users.service.interface.js';
import { NextFunction, Request, Response } from 'express';
import { UserLoginDto } from '../users/dto/user-login.dto.js';
import { UserRegisterDto } from '../users/dto/user-register.dto.js';
import { HttpError } from '../errors/http-error.class.js';
import { User } from './user.entity.js';
import { ValidationMiddleware } from '../common/validation.middleware.js';

@injectable()
export class UsersController extends BaseController implements IUsersController {
  constructor(
    @inject(TYPES.Logger) loggerService: ILogger,
    @inject(TYPES.UsersService) private usersService: IUsersService,
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: '/login',
        method: 'get',
        func: this.login,
      },
      {
        path: '/register',
        method: 'post',
        func: this.register,
        middlewares: [new ValidationMiddleware(UserRegisterDto)],
      },
    ]);
  }

  login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
    const user = new User(req.body.email, req.body.password);
    this.sendOk(res, user);
  }

  async register(
    { body }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.usersService.createUser(body);
    if (!result) return next(new HttpError(422, 'This user already exists'));
    this.sendOk(res, result);
  }
}
