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

    this.server.on('listening', () => {
      this.logger.log(`Server running on port ${this.port}...`);
    });

    this.server.on('error', (err: Error) => {
      this.logger.error(err.message);
    });
  }
}
