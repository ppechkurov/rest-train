import express, { Express } from 'express';
import { Server } from 'http';
import { ExceptionFilter } from './errors/exception.filter.class';
import { LoggerService } from './services/logger.service';
import { UsersController } from './users/users.controller';

export class App {
  public server: Server;

  constructor(
    public app: Express,
    public port: number,
    public logger: LoggerService,
    public usersController: UsersController,
    public exceptionFilter: ExceptionFilter
  ) {}

  useRoutes(): void {
    this.app.use('/users', this.usersController.router);
  }

  useExceptionFilter(): void {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public init() {
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
