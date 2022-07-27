import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Model, Repository, Sequelize } from 'sequelize-typescript';
import { TYPES } from '../types.js';
import { DbConfig } from './db.config.js';
import { UserModel } from '../sequelize/models/user.model.js';

@injectable()
export class RepositoryService {
  constructor(@inject(TYPES.DbConfig) config: DbConfig) {
    this.init(config);
  }

  public client: Sequelize;

  private init({ options }: DbConfig): void {
    this.client = new Sequelize(options);
    this.client.addModels([UserModel]);
  }

  public getRepository<T extends Model>(modelClass: new () => T): Repository<T> {
    return this.client.getRepository(modelClass);
  }
}
