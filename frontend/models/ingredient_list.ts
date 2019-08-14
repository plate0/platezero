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
import { RecipeVersionIngredientList } from './recipe_version_ingredient_list'

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

  public static async createAndLink(
    lists: IngredientListJSON[],
    versionId: number
  ): Promise<IngredientList[]> {
    return IngredientList.sequelize.transaction(async transaction => {
      const ingredientLists = await Promise.all(
        _.map(lists, il =>
          IngredientList.createWithIngredients(il, { transaction })
        )
      )
      await Promise.all(
        _.map(ingredientLists, (il, sort_key) =>
          RecipeVersionIngredientList.create(
            {
              recipe_version_id: versionId,
              ingredient_list_id: il.id,
              sort_key
            },
            { transaction }
          )
        )
      )
      return ingredientLists
    })
  }

  /**
   * Given an IngredientListJSON, return an IngredientListJSON based on the following:
   *
   * If the ingredient list DOES NOT have an `id`:
   *
   *   1. Create a new ingredient list
   *   2. For each ingredient, check whether it has an id. If it does, simply
   *      link the existing ingredient in the order specified by its array
   *      position. If it does not have an id, then a new line must be created
   *      with the specified properties.
   *
   * If the ingredient list DOES have an id, simply return the ingredient list
   * as queried from the database.
   */
  public static async findOrCreateWithIngredients(
    patch: IngredientListJSON,
    transaction?: any
  ): Promise<IngredientList> {
    if (!_.isUndefined(patch.id)) {
      return await IngredientList.findOne({
        where: { id: patch.id },
        include: [{ model: IngredientLine }],
        transaction
      })
    }
    const list = await IngredientList.create(
      { name: patch.name },
      { transaction }
    )
    const lines = _.map(patch.lines, async line => {
      if (!_.isUndefined(line.id)) {
        return await IngredientLine.findOne({
          where: { id: line.id },
          transaction
        })
      }
      return await IngredientLine.create(line, { transaction })
    })
    await Promise.all(
      _.map(
        lines,
        async (line, sort_key) =>
          await IngredientListLine.create(
            {
              ingredient_list_id: list.id,
              ingredient_line_id: (await line).id,
              sort_key
            },
            { transaction }
          )
      )
    )
    return list
  }
}
