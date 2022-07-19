import express from 'express';
import { App } from './app';
import { LoggerService } from './services/logger.service';
import { UsersController } from './users/users.controller';

function run(port: number) {
  const logger = new LoggerService();

  const app = new App(express(), port, logger, new UsersController(logger));

  app.init();
}

run(Number(process.env.PORT) || 5000);
