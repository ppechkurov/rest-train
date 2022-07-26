import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types.js';
import { App } from './app.js';
import { ILogger } from './services/logger.interface.js';
import { LoggerService } from './services/logger.service.js';
import { UsersController } from './users/users.controller.js';
import { ExceptionFilter } from './errors/exception.filter.class.js';
import { IUsersController } from './users/interfaces/users.controller.interface.js';
import { IUsersService } from './users/interfaces/users.service.interface.js';
import { UsersService } from './users/users.service.js';
import { IExceptionFilter } from './errors/exception.filter.interface.js';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<App>(TYPES.Application).to(App);
  bind<ILogger>(TYPES.ILogger).to(LoggerService);
  bind<IUsersController>(TYPES.IUsersController).to(UsersController);
  bind<IUsersService>(TYPES.IUsersService).to(UsersService);
  bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter);
});

function bootstrap(): { app: App; appContainer: Container } {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.Application);
  app.init(Number(process.env.PORT) || 5000);
  return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
