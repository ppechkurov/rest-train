import 'reflect-metadata';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ timestamps: false, tableName: 'Tags' })
export class TagModel extends Model<InferAttributes<TagModel>, InferCreationAttributes<TagModel>> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.UUID })
  declare creator: string;

  @Column({ type: DataType.STRING(40) })
  declare name: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare sortOrder: number;
}
