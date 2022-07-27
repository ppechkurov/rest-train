import { UserModel } from '../../sequelize/models/user.model.js';
import { UserLoginDto } from '../../users/dto/user-login.dto.js';
import { UserRegisterDto } from '../../users/dto/user-register.dto.js';

export interface IUsersService {
  createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
  validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
