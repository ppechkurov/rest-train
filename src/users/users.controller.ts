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
import { ValidationMiddleware } from '../common/validation.middleware.js';
import jwt from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface.js';

@injectable()
export class UsersController extends BaseController implements IUsersController {
  constructor(
    @inject(TYPES.Logger) loggerService: ILogger,
    @inject(TYPES.UsersService) private usersService: IUsersService,
    @inject(TYPES.ConfigService) private configService: IConfigService,
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: '/login',
        method: 'get',
        func: this.login,
        middlewares: [new ValidationMiddleware(UserLoginDto)],
      },
      {
        path: '/register',
        method: 'post',
        func: this.register,
        middlewares: [new ValidationMiddleware(UserRegisterDto)],
      },
    ]);
  }

  public async login(
    { body }: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.usersService.validateUser(body);
    if (!result) return next(new HttpError(401, 'Authorization error'));
    const jwt = await this.signJWT(body.email, this.configService.get('JWT_SECRET'));
    this.sendOk(res, jwt);
  }

  public async register(
    { body }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.usersService.createUser(body);
    if (!result) return next(new HttpError(422, 'This user already exists'));
    this.sendOk(res, result);
  }

  private signJWT(email: string, secret: string): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          email,
          iat: Math.floor(Date.now() / 1000),
        },
        secret,
        {
          algorithm: 'HS256',
        },
        (err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token as string);
        },
      );
    });
  }
}
