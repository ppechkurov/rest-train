import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../services/logger.service';
import { HttpError } from './http-error.class';

export class ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(
    error: Error | HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (error instanceof HttpError) {
      const { context, code, message } = error;
      this.logger.error(`[${context}] Error ${code}: ${message}`);
      res.status(error.code).send({ error: error.message });
    } else {
      this.logger.error(`${error.message}`);
      res.status(500).send({ error: error.message });
    }
  }
}
