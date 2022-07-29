import 'reflect-metadata';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { TagModel } from './tag.model';

@Table({ timestamps: false, tableName: 'Users' })
export class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  // @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  // declare id: CreationOptional<number>;
  @HasMany(() => TagModel)
  tags: CreationOptional<TagModel[]>;

  @Column({ primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare uid: CreationOptional<string>;

  @Column({ unique: true, type: DataType.STRING(100) })
  declare email: string;

  @Column({ type: DataType.STRING(100) })
  declare nickname: string;

  @Column({ type: DataType.STRING(60) })
  declare password: string;
}
