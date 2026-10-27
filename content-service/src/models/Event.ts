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

@Table({ tableName: 'events', underscored: true, paranoid: true })
export default class Event extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(80))
  declare slug: string;

  @AllowNull(false)
  @Column(DataType.STRING(160))
  declare titleEn: string;

  @AllowNull(false)
  @Column(DataType.STRING(160))
  declare titleHe: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare bodyEn: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare bodyHe: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare startsAt: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare endsAt: Date | null;

  @AllowNull(true)
  @Column(DataType.STRING(512))
  declare imageUrl: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare imageAltEn: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare imageAltHe: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(512))
  declare linkUrl: string | null;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isPublished: boolean;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare sortOrder: number;
}
