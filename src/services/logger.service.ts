import 'reflect-metadata';
import { injectable } from 'inversify';
import { ILogger } from './logger.interface.js';
import { Logger } from 'tslog';
import { HttpError } from '../errors/http-error.class.js';

@injectable()
export class LoggerService implements ILogger {
  private logger: Logger;

  constructor() {
    this.logger = new Logger({
      displayInstanceName: false,
      displayLoggerName: false,
      displayFilePath: 'hidden',
      displayFunctionName: false,
    });
  }

  log(...args: unknown[]): void {
    this.logger.info(...args);
  }

  warn(...args: unknown[]): void {
    this.logger.warn(...args);
  }

  error(error: HttpError): void;
  error(...args: unknown[]): void;
  error(...args: unknown[]): void {
    if (args[0] instanceof HttpError) {
      const { code, message, context } = args[0];
      const errorMessage = `${code}: ${message}` + `${context ?? ''}`;
      this.logger.error(errorMessage);
    } else {
      this.logger.error(...args);
    }
  }
}
