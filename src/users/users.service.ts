import { inject, injectable } from 'inversify';
import { IUsersService } from './interfaces/users.service.interface';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { UserModel } from '../sequelize/models/user.model';
import { UserRegisterDto } from '../users/dto/user-register.dto';
import { User } from './user.entity';
import { UserLoginDto } from '../users/dto/user-login.dto';
import { IUsersRepository } from './interfaces/users.repository.interface';

@injectable()
export class UsersService implements IUsersService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.UsersRepository) private users: IUsersRepository,
  ) {}

  async createUser({ email, nickname, password }: UserRegisterDto): Promise<UserModel | null> {
    const user = new User(email, nickname);
    const salt = this.configService.get('SALT');
    await user.setPassword(password, salt);
    return await this.users.create(user).catch(() => null);
  }

  async validateUser({ email, password }: UserLoginDto): Promise<UserModel | null> {
    const result = await this.users.find(email);
    if (!result) return null;

    const user = new User(result.email, result.nickname, result.password);
    const isValidUser = await user.compareHash(password);
    return isValidUser ? result : null;
  }

  async getInfo(email: string): Promise<UserModel | null> {
    const result = await this.users.getInfo(email);
    return result ?? null;
  }
}
