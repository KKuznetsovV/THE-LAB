import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'spirits', underscored: true, paranoid: true })
export default class Spirit extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING(32))
  declare category: string;

  @AllowNull(false)
  @Column(DataType.STRING(80))
  declare name: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare priceGlass: number | null;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare priceBottle: number | null;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isPublished: boolean;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare sortOrder: number;
}
