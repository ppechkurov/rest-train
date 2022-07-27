import { inject, injectable } from 'inversify';
import { IUsersService } from './interfaces/users.service.interface.js';
import { TYPES } from '../types.js';
import { IConfigService } from '../config/config.service.interface.js';
import { RepositoryService } from '../database/repository.service.js';
import { UserModel } from '../sequelize/models/user.model.js';
import { Repository } from 'sequelize-typescript';
import { UserRegisterDto } from '../users/dto/user-register.dto.js';
import { User } from './user.entity.js';
import { UserLoginDto } from '../users/dto/user-login.dto.js';

@injectable()
export class UsersService implements IUsersService {
  constructor(
    @inject(TYPES.IConfigService) private configService: IConfigService,
    @inject(TYPES.IRepositoryService) private repositoryService: RepositoryService,
  ) {
    this.users = this.repositoryService.getRepository(UserModel);
  }

  private users: Repository<UserModel>;

  async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
    const user = new User(email, name);
    const salt = this.configService.get('SALT');
    await user.setPassword(password, salt);

    try {
      return await this.users.create({
        name: user.name,
        email: user.email,
        password: user.password,
      });
    } catch (error) {
      return null;
    }
  }

  async validateUser(dto: UserLoginDto): Promise<boolean> {
    return true;
  }
}
