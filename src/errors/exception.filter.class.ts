import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types.js';
import { ILogger } from '../services/logger.interface.js';
import { HttpError } from './http-error.class.js';
import { NextFunction, Request, Response } from 'express';

@injectable()
export class ExceptionFilter {
  constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

  catch(error: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
    if (error instanceof HttpError) {
      this.logger.error(error);
      res.status(error.code);
    } else {
      this.logger.error(error.message);
      res.status(500);
    }
    res.send({ error: error.message });
  }
}
