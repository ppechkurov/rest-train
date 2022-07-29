import { inject, injectable } from 'inversify';
import { TagModel } from '../sequelize/models/tag.model';
import { TYPES } from '../types';
import { IUsersRepository } from '../users/interfaces/users.repository.interface';
import { TagCreateDto } from './dto/tag-create.dto';
import { ITagsRepository } from './interfaces/tags.repository.interface';
import { ITagsService } from './interfaces/tags.service.interface';
import { Tag } from './tag.entity';

@injectable()
export class TagsService implements ITagsService {
  constructor(
    @inject(TYPES.TagsRepository) private tags: ITagsRepository,
    @inject(TYPES.UsersRepository) private users: IUsersRepository,
  ) {}

  async createTag({ name, sortOrder }: TagCreateDto, userEmail: string): Promise<TagModel | null> {
    const newTag = new Tag(name, sortOrder);
    const creator = await this.users.find(userEmail);
    if (!creator) return null;

    newTag.creator = creator.uid;
    return this.tags.create(newTag);
  }
}
