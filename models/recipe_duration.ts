import {
  AllowNull,
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

export interface RecipeDurationJSON {
  id?: number
  duration_seconds: number
}

@Table({
  tableName: 'recipe_durations'
})
export class RecipeDuration extends Model<RecipeDuration>
  implements RecipeDurationJSON {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @AllowNull(false)
  @Column
  public duration_seconds: number
}
