import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Default,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { fn } from 'sequelize'
import * as _ from 'lodash'

import { Preheat } from './preheat'
import { RecipeYield } from './recipe_yield'
import { RecipeDuration } from './recipe_duration'
import { Recipe } from './recipe'
import { RecipeVersionPreheat } from './recipe_version_preheat'
import { User } from './user'
import { RecipeVersionIngredientList } from './recipe_version_ingredient_list'
import { RecipeVersionProcedureList } from './recipe_version_procedure_list'
import { ProcedureList } from './procedure_list'
import { IngredientList } from './ingredient_list'
import { RecipeVersionPatch } from '../common/request-models'
import { IngredientLine } from './ingredient_line'
import { ProcedureLine } from './procedure_line'

export interface RecipeVersionJSON {
  id?: number
  recipe_id?: number
  created_at?: Date | string
  user_id: number
  parent_recipe_version_id: number
  recipe_yield_id: number
  recipe_duration_id: number
  message: string
  recipe: Recipe
  author: User
  parentRecipeVersion: RecipeVersion
  recipeYield: RecipeYield
  recipeDuration: RecipeDuration
  procedureLists: ProcedureList[]
  ingredientLists: IngredientList[]
  preheats: Preheat[]
}

@Table({
  tableName: 'recipe_versions'
})
export class RecipeVersion extends Model<RecipeVersion>
  implements RecipeVersionJSON {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @AllowNull(false)
  @Column
  @ForeignKey(() => Recipe)
  public recipe_id: number

  @AllowNull(false)
  @Default(fn('NOW'))
  @Column
  public created_at: Date

  @AllowNull(false)
  @Column
  @ForeignKey(() => User)
  public user_id: number

  @Column
  @ForeignKey(() => RecipeVersion)
  public parent_recipe_version_id: number

  @Column
  @ForeignKey(() => RecipeYield)
  public recipe_yield_id: number

  @Column
  @ForeignKey(() => RecipeDuration)
  public recipe_duration_id: number

  @AllowNull(false)
  @Column
  public message: string

  @BelongsTo(() => Recipe)
  public recipe: Recipe

  @BelongsTo(() => User)
  public author: User

  @BelongsTo(() => RecipeVersion)
  public parentRecipeVersion: RecipeVersion

  @BelongsTo(() => RecipeYield)
  public recipeYield: RecipeYield

  @BelongsTo(() => RecipeDuration)
  public recipeDuration: RecipeDuration

  @BelongsToMany(() => ProcedureList, () => RecipeVersionProcedureList)
  public procedureLists: ProcedureList[]

  @BelongsToMany(() => IngredientList, () => RecipeVersionIngredientList)
  public ingredientLists: IngredientList[]

  @BelongsToMany(() => Preheat, () => RecipeVersionPreheat)
  public preheats: Preheat[]

  public static async createFromPrevious(
    id: number,
    patch: RecipeVersionPatch,
    userId: number,
    transaction?: any
  ): Promise<RecipeVersion> {
    const prev = await RecipeVersion.findOne({
      where: { id },
      include: [
        { model: IngredientList, include: [{ model: IngredientLine }] },
        { model: ProcedureList, include: [{ model: ProcedureLine }] },
        { model: Preheat }
      ],
      transaction
    })
    const v = await RecipeVersion.create(
      {
        recipe_id: prev.recipe_id,
        user_id: userId,
        message: patch.message,
        parent_recipe_version_id: prev.id,
        recipe_yield_id: prev.recipe_yield_id,
        recipe_duration_id: prev.recipe_duration_id
      },
      { transaction }
    )

    // procedure lists
    await Promise.all(
      _.map(patch.procedureLists, async (item, sort_key) => {
        const { id } = await ProcedureList.findOrCreateWithLines(
          item,
          transaction
        )
        return RecipeVersionProcedureList.create(
          { recipe_version_id: v.id, procedure_list_id: id, sort_key },
          { transaction }
        )
      })
    )

    // ingredients
    await Promise.all(
      _.map(patch.ingredientLists, async (item, sort_key) => {
        const { id } = await IngredientList.findOrCreateWithIngredients(
          item,
          transaction
        )
        return RecipeVersionIngredientList.create(
          { recipe_version_id: v.id, ingredient_list_id: id, sort_key },
          { transaction }
        )
      })
    )

    await Promise.all(
      _.map(prev.preheats, preheat =>
        RecipeVersionPreheat.create(
          { recipe_version_id: v.id, preheat_id: preheat.id },
          { transaction }
        )
      )
    )
    return v
  }
}
