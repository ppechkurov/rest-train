import { inject, injectable } from 'inversify';
import { Repository } from 'sequelize-typescript';
import { RepositoryService } from '../database/repository.service';
import { TagModel } from '../sequelize/models/tag.model';
import { UserModel } from '../sequelize/models/user.model';
import { TYPES } from '../types';
import { ITagsRepository } from './interfaces/tags.repository.interface';
import { Tag } from './tag.entity';

@injectable()
export class TagsRepository implements ITagsRepository {
  tags: Repository<TagModel>;
  constructor(@inject(TYPES.RepositoryService) repositoryService: RepositoryService) {
    this.tags = repositoryService.getRepository(TagModel);
  }

  async create({ name, creatorId, sortOrder }: Tag): Promise<TagModel | null> {
    return this.tags.create({ name, creatorId, sortOrder });
  }

  async findById(id: number): Promise<TagModel | null> {
    return this.tags.findByPk(id, { include: UserModel, attributes: { exclude: ['creatorId'] } });
  }
  //
  // async getInfo(email: string): Promise<UserModel | null> {
  //   return this.users.findOne({ where: { email }, attributes: ['id', 'email', 'name'] });
  // }
}
