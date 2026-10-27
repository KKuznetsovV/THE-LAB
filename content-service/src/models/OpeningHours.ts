import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table({ tableName: 'opening_hours', underscored: true })
export default class OpeningHours extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.INTEGER)
  declare dayOfWeek: number;

  @AllowNull(false)
  @Column(DataType.STRING(5))
  declare opensAt: string;

  @AllowNull(false)
  @Column(DataType.STRING(5))
  declare closesAt: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isClosed: boolean;
}
