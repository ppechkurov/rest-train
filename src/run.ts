import { App } from './app';
import { LoggerService } from './services/logger.service';

function run(port: number) {
  const app = new App(port, new LoggerService());
  app.init();
}

run(Number(process.env.PORT) || 5000);
