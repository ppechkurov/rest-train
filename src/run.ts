import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types.js';
import { App } from './app.js';
import { ILogger } from './services/logger.interface.js';
import { LoggerService } from './services/logger.service.js';
import { UsersController } from './users/users.controller.js';
import { ExceptionFilter } from './errors/exception.filter.class.js';

const appContainer = new Container();
appContainer.bind<App>(TYPES.Application).to(App);
appContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService);
appContainer.bind<UsersController>(TYPES.UsersController).to(UsersController);
appContainer.bind<ExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);

const app = appContainer.get<App>(TYPES.Application);
app.init(Number(process.env.PORT) || 5000);

export { app, appContainer };
