import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { UserModel } from './user.model';

@Table({ timestamps: false, tableName: 'RefreshTokens' })
export class RefreshTokenModel extends Model<
  InferAttributes<RefreshTokenModel>,
  InferCreationAttributes<RefreshTokenModel>
> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.STRING })
  declare value: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.UUID })
  declare userId: string;

  @BelongsTo(() => UserModel)
  declare user: CreationOptional<UserModel>;
}
