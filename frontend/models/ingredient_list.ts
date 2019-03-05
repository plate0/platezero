import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  ICreateOptions,
  Table
} from 'sequelize-typescript'
import * as _ from 'lodash'
import { IngredientLine, IngredientLineJSON } from './ingredient_line'
import { IngredientListLine } from './ingredient_list_line'

export interface IngredientListJSON {
  name?: string
  ingredients: IngredientLineJSON[]
}

@Table({
  tableName: 'ingredient_lists'
})
export class IngredientList extends Model<IngredientList> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @Column public name: string

  public static async createWithIngredients(
    il: IngredientListJSON,
    options?: ICreateOptions
  ): Promise<IngredientList> {
    const ingredientList = await IngredientList.create(
      { name: il.name },
      options
    )
    const ingredientLines = await Promise.all(
      _.map(il.ingredients, ingredient =>
        IngredientLine.create(ingredient, options)
      )
    )
    await Promise.all(
      _.map(ingredientLines, (line, sort_key) =>
        IngredientListLine.create(
          {
            ingredient_list_id: ingredientList.id,
            ingredient_line_id: line.id,
            sort_key
          },
          options
        )
      )
    )
    return ingredientList
  }
}
