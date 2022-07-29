import { TagModel } from '../../sequelize/models/tag.model';
import { Tag } from '../tag.entity';

export interface ITagsRepository {
  create: (tag: Tag) => Promise<TagModel | null>;
  findById: (id: number) => Promise<TagModel | null>;
}
