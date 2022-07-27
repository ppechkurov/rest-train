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
import { IConfigService } from './config/config.service.interface.js';
import { ConfigService } from './config/config.service.js';
import { IExceptionFilter } from './errors/exception.filter.interface.js';
import { RepositoryService } from './database/repository.service.js';
import { DbConfig } from './database/db.config.js';
import { IUsersRepository } from './users/interfaces/users.repository.interface.js';
import { UsersRepository } from './users/users.repository.js';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<App>(TYPES.Application).to(App);
  bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
  bind<IUsersController>(TYPES.UsersController).to(UsersController);
  bind<IUsersService>(TYPES.UsersService).to(UsersService);
  bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
  bind<RepositoryService>(TYPES.RepositoryService).to(RepositoryService).inSingletonScope();
  bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
  bind<DbConfig>(TYPES.DbConfig).to(DbConfig).inSingletonScope();
  bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
});

async function bootstrap(): Promise<{ app: App; appContainer: Container }> {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.Application);
  app.init(Number(process.env.PORT) || 5000);
  return { app, appContainer };
}

export const { app, appContainer } = await bootstrap();
