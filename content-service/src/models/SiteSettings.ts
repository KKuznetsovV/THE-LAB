import { AllowNull, Column, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ tableName: 'site_settings', underscored: true })
export default class SiteSettings extends Model {
  @PrimaryKey
  @Column(DataType.STRING(16))
  declare id: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(512))
  declare reservationUrl: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(512))
  declare reservationUrlAlt: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(512))
  declare deliveryUrl: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(512))
  declare woltUrl: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(512))
  declare privateEventsUrl: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(512))
  declare giftCardUrl: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(512))
  declare instagramUrl: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(512))
  declare mapsUrl: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(32))
  declare phone: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(160))
  declare email: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(255))
  declare addressHe: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(255))
  declare addressEn: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(255))
  declare alcoholWarningHe: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(255))
  declare alcoholWarningEn: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(160))
  declare accessibilityCoordinatorName: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(32))
  declare accessibilityCoordinatorPhone: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(160))
  declare accessibilityCoordinatorEmail: string;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  declare lastAccessibilityAudit: string | null;

  @AllowNull(false)
  @Default('18:00')
  @Column(DataType.STRING(5))
  declare happyHourStartsAt: string;

  @AllowNull(false)
  @Default('20:00')
  @Column(DataType.STRING(5))
  declare happyHourEndsAt: string;

  @AllowNull(false)
  @Default(50)
  @Column(DataType.INTEGER)
  declare happyHourDiscountPercent: number;
}
