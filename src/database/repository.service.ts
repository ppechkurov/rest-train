import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Model, Repository, Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { TYPES } from '../types.js';
import { IConfigService } from '../config/config.service.interface.js';
import { Dialect } from 'sequelize';
import { UserModel } from '../sequelize/models/user.model.js';

@injectable()
export class RepositoryService {
  public client: Sequelize;

  constructor(@inject(TYPES.IConfigService) private configService: IConfigService) {
    this.init();
  }

  private init(): void {
    const options: SequelizeOptions = {
      database: this.configService.get('DB_NAME'),
      username: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      dialect: this.configService.get('DB_DIALECT') as Dialect,
      models: [UserModel],
    };
    this.client = new Sequelize(options);
  }

  public getRepository<T extends Model>(modelClass: new () => T): Repository<T> {
    return this.client.getRepository(modelClass);
  }
}
