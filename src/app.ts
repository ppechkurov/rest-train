import express, { Express } from 'express';
import { Server } from 'http';
import { LoggerService } from './services/logger.service';

export class App {
  port: number;
  app: Express;
  server: Server;
  logger: LoggerService;

  constructor(port: number, logger: LoggerService) {
    this.port = port;
    this.app = express();
    this.logger = logger;
  }

  public init() {
    this.server = this.app.listen(this.port);
    this.logger.log(`Server running on port ${this.port}...`);
  }
}
