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
    ]);
  }

  async create(
    { body, user }: Request<{}, {}, TagCreateDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.tagsService.createTag(body, user);
    if (!result) return next(new HttpError(422, 'error creating tag'));
    res.json({ ok: result });
  }
}
