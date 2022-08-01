import { UserModel } from '../sequelize/models/user.model';

export interface IJwtService {
  generateTokens: (user: UserModel) => Promise<{ accessToken: string; refreshToken: string }>;
}
