import { RefreshTokenModel } from '../sequelize/models/refresh-token.model';
import { UserModel } from '../sequelize/models/user.model';
import { UserTokenDto } from '../users/dto/user-token.dto';

export interface IJwtService {
  generateTokens: (user: UserModel) => Promise<{ accessToken: string; refreshToken: string }>;
  validateRefreshToken: (token: string) => UserTokenDto | null;
  findRefreshToken: (token: string) => Promise<RefreshTokenModel | null>;
}
