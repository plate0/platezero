import {
  AllowNull,
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

export interface RecipeYieldJSON {
  id?: number
  text: string
}

@Table({
  tableName: 'recipe_yields'
})
export class RecipeYield extends Model<RecipeYield> implements RecipeYieldJSON {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @AllowNull(false)
  @Column
  public text: string
}
