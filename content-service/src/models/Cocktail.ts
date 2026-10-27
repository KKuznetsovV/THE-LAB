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

@Table({ tableName: 'cocktails', underscored: true, paranoid: true })
export default class Cocktail extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(6))
  declare code: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(16))
  declare indexLabel: string;

  @AllowNull(false)
  @Column(DataType.STRING(32))
  declare section: string;

  @AllowNull(false)
  @Column(DataType.STRING(80))
  declare nameEn: string;

  @AllowNull(false)
  @Column(DataType.STRING(80))
  declare nameHe: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare ingredientsEn: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare ingredientsHe: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare descriptionEn: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare descriptionHe: string | null;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare price: number | null;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  declare flavours: string[];

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isSignature: boolean;

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
