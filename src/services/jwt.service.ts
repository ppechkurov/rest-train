import { IJwtService } from './jwt.service.interface';
import jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { UserModel } from '../sequelize/models/user.model';
import { RefreshTokenModel } from '../sequelize/models/refresh-token.model';
import { Repository } from 'sequelize-typescript';
import { RepositoryService } from '../database/repository.service';
import { UserTokenDto } from '../users/dto/user-token.dto';

@injectable()
export class JwtService implements IJwtService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;

  private readonly tokens: Repository<RefreshTokenModel>;
  constructor(
    @inject(TYPES.ConfigService) configService: IConfigService,
    @inject(TYPES.RepositoryService) repositoryService: RepositoryService,
  ) {
    this.accessSecret = configService.get('JWT_ACCESS_SECRET');
    this.refreshSecret = configService.get('JWT_REFRESH_SECRET');
    this.tokens = repositoryService.getRepository(RefreshTokenModel);
  }

  public async generateTokens(
    user: UserModel,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.sign(user.uid, user.email, this.accessSecret, '15s'),
      this.sign(user.uid, user.email, this.refreshSecret, '1d'),
    ]);
    await this.tokens.create({ userId: user.uid, value: refreshToken });
    return { accessToken, refreshToken };
  }

  public validateRefreshToken(token: string): UserTokenDto | null {
    try {
      const userData = jwt.verify(token, this.refreshSecret);
      return userData as UserTokenDto;
    } catch (error) {
      return null;
    }
  }

  public async findRefreshToken(token: string): Promise<RefreshTokenModel | null> {
    const result = await this.tokens.findOne({ where: { value: token } });
    return result ?? null;
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
