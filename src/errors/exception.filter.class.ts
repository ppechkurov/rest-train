import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../services/logger.service';
import { HttpError } from './http-error.class';

export class ExceptionFilter {
  constructor(private logger: LoggerService) {}

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
