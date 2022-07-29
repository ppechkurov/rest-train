import { inject, injectable } from 'inversify';
import { Repository } from 'sequelize-typescript';
import { RepositoryService } from '../database/repository.service';
import { TagModel } from '../sequelize/models/tag.model';
import { TYPES } from '../types';
import { ITagsRepository } from './interfaces/tags.repository.interface';
import { Tag } from './tag.entity';

@injectable()
export class TagsRepository implements ITagsRepository {
  tags: Repository<TagModel>;
  constructor(@inject(TYPES.RepositoryService) repositoryService: RepositoryService) {
    this.tags = repositoryService.getRepository(TagModel);
  }

  async create({ name, creator, sortOrder }: Tag): Promise<TagModel | null> {
    return this.tags.create({ name, creator, sortOrder });
  }

  // async find(email: string): Promise<UserModel | null> {
  //   return this.users.findOne({ where: { email } });
  // }
  //
  // async getInfo(email: string): Promise<UserModel | null> {
  //   return this.users.findOne({ where: { email }, attributes: ['id', 'email', 'name'] });
  // }
}
