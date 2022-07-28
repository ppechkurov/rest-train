import { inject, injectable } from 'inversify';
import { SequelizeOptions } from 'sequelize-typescript';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface.js';
import { Dialect } from 'sequelize';

@injectable()
export class DbConfig {
  public readonly options: SequelizeOptions;

  constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {
    const env = process.env.NODE_ENV ?? this.configService.get('NODE_ENV');

    this.options = {
      database: env === 'test' ? 'test_db' : this.configService.get('DB_NAME'),
      username: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      dialect: this.configService.get('DB_DIALECT') as Dialect,
      logging: env === 'production' ? true : false,
    };
    console.log(this.options);
  }
}
