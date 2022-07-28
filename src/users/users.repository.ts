import { inject, injectable } from 'inversify';
import { Repository } from 'sequelize-typescript';
import { RepositoryService } from '../database/repository.service.js';
import { UserModel } from '../sequelize/models/user.model.js';
import { TYPES } from '../types.js';
import { IUsersRepository } from './interfaces/users.repository.interface.js';
import { User } from './user.entity.js';

@injectable()
export class UsersRepository implements IUsersRepository {
  users: Repository<UserModel>;
  constructor(@inject(TYPES.RepositoryService) repositoryService: RepositoryService) {
    this.users = repositoryService.getRepository(UserModel);
  }

  async create({ name, email, passwordHash }: User): Promise<UserModel> {
    return this.users.create({ name, email, hash: passwordHash });
  }

  async find(email: string): Promise<UserModel | null> {
    return this.users.findOne({ where: { email } });
  }
}
