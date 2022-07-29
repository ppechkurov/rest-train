import { BaseController } from '../common/base.controller';
import { ITagsController } from './interfaces/tags.controller.interface';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../services/logger.interface';
import { ValidationMiddleware } from '../common/validation.middleware';
import { TagCreateDto } from './dto/tag-create.dto';
import { ITagsService } from './interfaces/tags.service.interface';
import { HttpError } from '../errors/http-error.class';
import { AuthGuard } from '../common/auth.guard';
import { QueryDto } from './dto/query.dto';

@injectable()
export class TagsController extends BaseController implements ITagsController {
  router: Router;

  constructor(
    @inject(TYPES.Logger) logger: ILogger,
    @inject(TYPES.TagsService) private tagsService: ITagsService,
  ) {
    super(logger);
    this.bindRoutes([
      {
        path: '/',
        method: 'post',
        func: this.create,
        middlewares: [new ValidationMiddleware(TagCreateDto), new AuthGuard()],
      },
      {
        path: '/:id',
        method: 'get',
        func: this.findById,
        middlewares: [new AuthGuard()],
      },
      {
        path: '/',
        method: 'get',
        func: this.findAll,
        middlewares: [new AuthGuard()],
      },
    ]);
  }

  async create(
    { body, user }: Request<{}, {}, TagCreateDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.tagsService.createTag(body, user);
    if (!result) return next(new HttpError(422, 'error creating tag'));

    const { id, name, sortOrder } = result;
    this.sendCreated(res, { id, name, sortOrder });
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const result = await this.tagsService.findById(Number(req.params.id));
    this.sendOk(res, result);
  }

  async findAll({ query }: Request, res: Response, next: NextFunction): Promise<void> {
    const result = await this.tagsService.findAll({
      offset: Number(query.offset),
      length: Number(query.length),
      sortByOrder: Number(query.sortByOrder),
      sortByName: Number(query.sortByName),
    });

    this.sendOk(res, { result, query });
  }
}
