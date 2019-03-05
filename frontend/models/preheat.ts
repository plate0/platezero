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
  tableName: 'preheats'
})
export class Preheat extends Model<Preheat> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @AllowNull(false)
  @Column
  public name: string

  @AllowNull(false)
  @Column
  public temperature: number

  @AllowNull(false)
  @IsIn([['C', 'F']])
  @Column
  public unit: string
}
