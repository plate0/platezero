import {
  AllowNull,
  AutoIncrement,
  Column,
  IsIn,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

@Table({
  tableName: 'oven_preheats'
})
export class OvenPreheat extends Model<OvenPreheat> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @AllowNull(false)
  @Column
  public temperature: number

  @AllowNull(false)
  @IsIn([['C', 'F']])
  @Column
  public unit: string
}
