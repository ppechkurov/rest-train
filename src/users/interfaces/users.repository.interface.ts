import { UserModel } from '../../sequelize/models/user.model.js';
import { User } from '../user.entity.js';

export interface IUsersRepository {
  create: (user: User) => Promise<UserModel>;
  find: (email: string) => Promise<UserModel | null>;
}
