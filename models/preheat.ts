import {
  AllowNull,
  AutoIncrement,
  Column,
  IsIn,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

export interface PreheatJSON {
  id?: number
  name: string
  temperature: number
  unit: string
}

@Table({
  tableName: 'preheats'
})
export class Preheat extends Model<Preheat> implements PreheatJSON {
  @AutoIncrement
  @PrimaryKey
  @Column
  public declare id: number

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
