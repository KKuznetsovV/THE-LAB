import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Cocktail from './Cocktail';

@Table({ tableName: 'bottles', underscored: true, paranoid: true })
export default class Bottle extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @ForeignKey(() => Cocktail)
  @Column(DataType.UUID)
  declare cocktailId: string;

  @BelongsTo(() => Cocktail)
  declare cocktail?: Cocktail;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare price200: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare price500: number;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare isAvailable: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isPublished: boolean;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare sortOrder: number;

  @AllowNull(true)
  @Column(DataType.STRING(512))
  declare imageUrl: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare imageAltEn: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare imageAltHe: string | null;
}
