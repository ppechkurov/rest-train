import { TagModel } from '../../sequelize/models/tag.model';
import { QueryDto } from '../dto/query.dto';
import { Tag } from '../tag.entity';

export interface ITagsRepository {
  create: (tag: Tag) => Promise<TagModel | null>;
  findById: (id: number) => Promise<TagModel | null>;
  findAll: (options: QueryDto) => Promise<TagModel[] | null>;
}
