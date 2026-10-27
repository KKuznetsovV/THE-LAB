import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'gallery_images', underscored: true, paranoid: true })
export default class GalleryImage extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING(512))
  declare url: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare altEn: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare altHe: string;

  @AllowNull(true)
  @Column(DataType.STRING(160))
  declare credit: string | null;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare sortOrder: number;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isPublished: boolean;
}
