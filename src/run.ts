import { App } from './app';

function run(port: number) {
  const app = new App(port);
  app.init();
}

run(5000);
