import {
  AllowNull,
  Column,
  ForeignKey,
  PrimaryKey,
  Model,
  Table
} from 'sequelize-typescript'

import { IngredientLine } from './ingredient_line'
import { IngredientList } from './ingredient_list'

export interface IngredientListLineJSON {
  ingredient_list_id: number
  ingredient_line_id: number
}

@Table({
  tableName: 'ingredient_list_lines'
})
export class IngredientListLine extends Model<IngredientListLine>
  implements IngredientListLineJSON {
  @AllowNull(false)
  @PrimaryKey
  @Column
  @ForeignKey(() => IngredientList)
  public ingredient_list_id: number

  @AllowNull(false)
  @PrimaryKey
  @Column
  @ForeignKey(() => IngredientLine)
  public ingredient_line_id: number

  @Column public sort_key: number
}
