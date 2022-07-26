import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface.js';
import { UserLoginDto } from '../dto/user-login.dto.js';
import { UserRegisterDto } from '../dto/user-register.dto.js';
import { TYPES } from '../types.js';
import { IUsersService } from './interfaces/users.service.interface.js';
import { User } from './user.entity.js';

@injectable()
export class UsersService implements IUsersService {
  constructor(@inject(TYPES.IConfigService) private configService: IConfigService) {}

  async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
    const user = new User(email, name);
    const salt = this.configService.get('SALT');
    await user.setPassword(password, salt);
    return null;
  }

  async validateUser(dto: UserLoginDto): Promise<boolean> {
    return true;
  }
}
