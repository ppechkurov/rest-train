import express from 'express';
import { App } from './app.js';
import { ExceptionFilter } from './errors/exception.filter.class.js';
import { LoggerService } from './services/logger.service.js';
import { UsersController } from './users/users.controller.js';

function run(port: number): void {
  const logger = new LoggerService();

  const app = new App(
    express(),
    port,
    logger,
    new UsersController(logger),
    new ExceptionFilter(logger),
  );

  app.init();
}

run(Number(process.env.PORT) || 5000);
