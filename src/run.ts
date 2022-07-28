import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { App } from './app';
import { ILogger } from './services/logger.interface';
import { LoggerService } from './services/logger.service';
import { UsersController } from './users/users.controller';
import { ExceptionFilter } from './errors/exception.filter.class';
import { IUsersController } from './users/interfaces/users.controller.interface';
import { IUsersService } from './users/interfaces/users.service.interface';
import { UsersService } from './users/users.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { RepositoryService } from './database/repository.service';
import { DbConfig } from './database/db.config';
import { IUsersRepository } from './users/interfaces/users.repository.interface';
import { UsersRepository } from './users/users.repository';

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
  await app.init(Number(process.env.PORT) || 5000);
  return { app, appContainer };
}

export const boot = bootstrap();
