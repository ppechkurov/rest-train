import 'reflect-metadata';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ timestamps: false, tableName: 'Users' })
export class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  declare id: CreationOptional<number>;

  @Column
  declare name: string;

  @Column({ unique: true })
  declare email: string;

  @Column
  declare password: string;
}
