import { injectable } from 'inversify';
import { UserLoginDto } from '../dto/user-login.dto.js';
import { UserRegisterDto } from '../dto/user-register.dto.js';
import { IUsersService } from './interfaces/users.service.interface.js';
import { User } from './user.entity.js';

@injectable()
export class UsersService implements IUsersService {
  async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
    const user = new User(email, name);
    await user.setPassword(password);
    return null;
  }

  async validateUser(dto: UserLoginDto): Promise<boolean> {
    return true;
  }
}
