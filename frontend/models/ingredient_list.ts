import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

@Table({
  tableName: 'ingredient_lists'
})
export class IngredientList extends Model<IngredientList> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @Column public name: string
}
