import { Logger } from 'tslog';
import { HttpError } from '../errors/http-error.class.js';

export class LoggerService {
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
      const errorMessage = `${code}: ${message} at ${context}`;
      this.logger.error(errorMessage);
    } else {
      this.logger.error(...args);
    }
  }
}
