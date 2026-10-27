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

@Table({ tableName: 'admins', underscored: true })
export default class Admin extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(160))
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING(80))
  declare name: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare passwordHash: string;

  @AllowNull(false)
  @Column(DataType.STRING(16))
  declare role: string;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare isActive: boolean;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare lastLoginAt: Date | null;
}
