import { inject, injectable } from 'inversify';
import { SequelizeOptions } from 'sequelize-typescript';
import { TYPES } from '../types.js';
import { IConfigService } from '../config/config.service.interface.js';
import { Dialect } from 'sequelize';

@injectable()
export class DbConfig {
  public readonly options: SequelizeOptions;

  constructor(@inject(TYPES.IConfigService) private configService: IConfigService) {
    this.options = {
      database: this.configService.get('DB_NAME'),
      username: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      dialect: this.configService.get('DB_DIALECT') as Dialect,
      logging: this.configService.get('NODE_ENV') === 'production' ? true : false,
    };
  }
}
