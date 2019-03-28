import {
  Model,
  AutoIncrement,
  PrimaryKey,
  Column,
  BelongsToMany,
  ICreateOptions,
  Table
} from 'sequelize-typescript'
import * as _ from 'lodash'
import { IngredientLine, IngredientLineJSON } from './ingredient_line'
import { IngredientListLine } from './ingredient_list_line'
import { normalize } from '../common/model-helpers'

export interface IngredientListJSON {
  id?: number
  lines: IngredientLineJSON[]
  image_url?: string
  name?: string
}

@Table({
  tableName: 'ingredient_lists'
})
export class IngredientList extends Model<IngredientList>
  implements IngredientListJSON {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @Column public name: string

  @Column public image_url: string

  @BelongsToMany(() => IngredientLine, () => IngredientListLine)
  public lines: IngredientLine[]

  public static async createWithIngredients(
    il: IngredientListJSON,
    options?: ICreateOptions
  ): Promise<IngredientList> {
    const ingredientList = await IngredientList.create(
      { name: il.name, image_url: il.image_url },
      options
    )
    const ingredientLines = await Promise.all(
      _.map(il.lines, ingredient =>
        IngredientLine.create(normalize(ingredient), options)
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
