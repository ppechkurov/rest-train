import { IJwtService } from './jwt.service.interface';
import jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { UserModel } from '../sequelize/models/user.model';

@injectable()
export class JwtService implements IJwtService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  constructor(@inject(TYPES.ConfigService) configService: IConfigService) {
    this.accessSecret = configService.get('JWT_ACCESS_SECRET');
    this.refreshSecret = configService.get('JWT_REFRESH_SECRET');
  }

  public async generateTokens(
    user: UserModel,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.sign(user.id, user.email, this.accessSecret, '15s'),
      this.sign(user.id, user.email, this.refreshSecret, '1d'),
    ]);
    return { accessToken, refreshToken };
  }

  private async sign(id: string, email: string, secret: string, lifetime: string): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          id,
          email,
          iat: Math.floor(Date.now() / 1000),
        },
        secret,
        {
          algorithm: 'HS256',
          expiresIn: lifetime,
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
