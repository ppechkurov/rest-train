import express, { Express } from 'express';
import { Server } from 'http';
import { LoggerService } from './services/logger.service';
import { UsersController } from './users/users.controller';

export class App {
  public server: Server;

  constructor(
    public app: Express,
    public port: number,
    public logger: LoggerService,
    public usersController: UsersController
  ) {}

  useRoutes() {
    this.app.use('/users', this.usersController.router);
  }

  public init() {
    this.useRoutes();

    this.server = this.app.listen(this.port);

    this.server.on('listening', () => {
      this.logger.log(`Server running on port ${this.port}...`);
    });

    this.server.on('error', (err: Error) => {
      this.logger.error(err.message);
    });
  }
}
