import { NextFunction, Request, Response, Router } from 'express';

export interface ITagsController {
  router: Router;
  create: (req: Request, res: Response, next: NextFunction) => void;
}
