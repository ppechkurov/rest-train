import { TagModel } from '../../sequelize/models/tag.model.js';
import { TagCreateDto } from '../../tags/dto/tag-create.dto.js';

export interface ITagsService {
  createTag: (dto: TagCreateDto, userEmail: string) => Promise<TagModel | null>;
}
