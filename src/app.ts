import express, { Express } from 'express';
import { Server } from 'http';

export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
  }

  public init() {
    this.server = this.app.listen(this.port);
    console.log(`Server running on port ${this.port}...`);
  }
}
