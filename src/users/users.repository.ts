import { inject, injectable } from 'inversify';
import { Repository } from 'sequelize-typescript';
import { RepositoryService } from '../database/repository.service';
import { UserModel } from '../sequelize/models/user.model';
import { TYPES } from '../types';
import { IUsersRepository } from './interfaces/users.repository.interface';
import { User } from './user.entity';

@injectable()
export class UsersRepository implements IUsersRepository {
  users: Repository<UserModel>;
  constructor(@inject(TYPES.RepositoryService) repositoryService: RepositoryService) {
    this.users = repositoryService.getRepository(UserModel);
  }

  async create({ nickname, email, password }: User): Promise<UserModel> {
    return this.users.create({ nickname, email, password });
  }

  async find(email: string): Promise<UserModel | null> {
    return this.users.findOne({ where: { email } });
  }

  async getInfo(email: string): Promise<UserModel | null> {
    return this.users.findOne({ where: { email }, attributes: ['uid', 'email', 'nickname'] });
  }
}
