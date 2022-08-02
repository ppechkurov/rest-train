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
import { IConfigService } from '../config/config.service.interface';
import { AuthGuard } from '../common/auth.guard';
import { IJwtService } from '../services/jwt.service.interface';
import { UserTokenDto } from './dto/user-token.dto';

@injectable()
export class UsersController extends BaseController implements IUsersController {
  constructor(
    @inject(TYPES.Logger) loggerService: ILogger,
    @inject(TYPES.UsersService) private usersService: IUsersService,
    @inject(TYPES.JwtService) private jswService: IJwtService,
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
      {
        path: '/refresh',
        method: 'get',
        func: this.refresh,
        middlewares: [],
      },
      {
        path: '/logout',
        method: 'get',
        func: this.logout,
        middlewares: [],
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

    const jwt = await this.jswService.generateTokens(result);
    res.cookie('refreshToken', jwt.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      signed: true,
      secure: true,
      path: '/users/refresh',
    });
    this.sendOk(res, { ...jwt, user: new UserTokenDto(result) });
  }

  public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.clearCookie('refreshToken', { secure: true, httpOnly: true, path: '/users/refresh' });
    this.sendOk(res, { message: 'logout' });
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
    { user, signedCookies }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { refreshToken } = signedCookies;
    console.log('signedCookies: ', refreshToken);
    const result = await this.usersService.getInfo(user).catch((err) => err);
    if (!result || result instanceof Error)
      return next(new HttpError(422, result.message ?? 'No such user'));
    this.sendOk(res, { info: result });
  }

  public async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { refreshToken } = req.signedCookies;
    res.json(refreshToken);
  }
}
