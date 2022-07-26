import { UserLoginDto } from '../../dto/user-login.dto.js';
import { UserRegisterDto } from '../../dto/user-register.dto.js';
import { User } from '../user.entity.js';

export interface IUsersService {
  createUser: (dto: UserRegisterDto) => Promise<User | null>;
  validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
