import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { IUsersController } from './interfaces/users.controller.interface';
import { TYPES } from '../types';
import { ILogger } from '../services/logger.interface';
import { IUsersService } from './interfaces/users.service.interface';
import { NextFunction, Request, Response } from 'express';
import { UserLoginDto } from '../users/dto/user-login.dto';
import { UserRegisterDto } from '../users/dto/user-register.dto';
import { HttpError } from '../errors/http-error.class';
import { ValidationMiddleware } from '../common/validation.middleware';
import jwt from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { AuthGuard } from '../common/auth.guard';

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
      {
        path: '/info',
        method: 'get',
        func: this.info,
        middlewares: [new AuthGuard()],
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
    this.sendCreated(res, result);
  }

  public async info(
    { user }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.usersService.getInfo(user);
    if (!result) return next(new HttpError(422, 'No such user'));
    this.sendOk(res, { info: result });
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
