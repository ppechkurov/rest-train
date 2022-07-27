import { inject, injectable } from 'inversify';
import { IConfigService } from './config.service.interface.js';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { TYPES } from '../types.js';
import { ILogger } from '../services/logger.interface.js';

@injectable()
export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;

  constructor(@inject(TYPES.Logger) private logger: ILogger) {
    const result: DotenvConfigOutput = config();

    if (result.error) {
      this.logger.error('Error parsing .env configuration...');
    } else {
      this.logger.log('.env configuration loaded...');
      this.config = result.parsed as DotenvParseOutput;
    }
  }

  get(key: string): string {
    return this.config[key];
  }
}
