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

import { Preheat } from './preheat'
import { RecipeYield } from './recipe_yield'
import { Recipe } from './recipe'
import { RecipeVersionPreheat } from './recipe_version_preheat'
import { User } from './user'
import { RecipeVersionIngredientList } from './recipe_version_ingredient_list'
import { RecipeVersionProcedureList } from './recipe_version_procedure_list'
import { ProcedureList } from './procedure_list'
import { IngredientList } from './ingredient_list'

@Table({
  tableName: 'recipe_versions'
})
export class RecipeVersion extends Model<RecipeVersion> {
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

  @BelongsToMany(() => ProcedureList, () => RecipeVersionProcedureList)
  public procedureLists: ProcedureList[]

  @BelongsToMany(() => IngredientList, () => RecipeVersionIngredientList)
  public ingredientLists: IngredientList[]

  @BelongsToMany(() => Preheat, () => RecipeVersionPreheat)
  public preheats: Preheat[]
}
