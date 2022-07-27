import 'reflect-metadata';
import express, { Express, NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Server } from 'http';
import { ILogger } from './services/logger.interface.js';
import { TYPES } from './types.js';
import { IUsersController } from './users/interfaces/users.controller.interface.js';
import { RepositoryService } from './database/repository.service.js';
import { IExceptionFilter } from './errors/exception.filter.interface.js';
import bodyParser from 'body-parser';

@injectable()
export class App {
  public app: Express;
  public port: number;
  public server: Server;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IUsersController) private usersController: IUsersController,
    @inject(TYPES.IRepositoryService) private repositoryService: RepositoryService,
    @inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
  ) {}

  useRoutes(): void {
    this.app.use('/users', this.usersController.router);
  }

  useMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const { method, url } = req;
      this.logger.log(`Incoming ${method}-request: ${url}`);
      next();
    });
  }

  useExceptionFilter(): void {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init(port: number): Promise<void> {
    this.repositoryService.client.authenticate();
    this.logger.log('Database initialized...');
    await this.repositoryService.client.sync();
    this.logger.log('All models are syncronized...');

    this.app = express();
    this.port = port;

    this.useMiddlewares();
    this.useRoutes();
    this.useExceptionFilter();

    this.server = this.app.listen(this.port);
    this.server
      .on('listening', () => {
        this.logger.log(`Server running on port ${this.port}...`);
      })
      .on('error', (err: Error) => {
        this.logger.error(err);
      });
  }
}
