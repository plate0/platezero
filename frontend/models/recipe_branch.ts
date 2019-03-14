import {
  AllowNull,
  BelongsTo,
  Column,
  PrimaryKey,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript'

import { RecipeVersion, RecipeVersionJSON } from './recipe_version'
import { Recipe, RecipeJSON } from './recipe'

export interface RecipeBranchJSON {
  recipe_id: number
  name: string
  recipe_version_id: number
  recipe: RecipeJSON
  recipeVersion: RecipeVersionJSON
}

@Table({
  tableName: 'recipe_branches'
})
export class RecipeBranch extends Model<RecipeBranch> {
  @AllowNull(false)
  @PrimaryKey
  @Column
  @ForeignKey(() => Recipe)
  public recipe_id: number

  @AllowNull(false)
  @PrimaryKey
  @Column
  public name: string

  @AllowNull(false)
  @Column
  @ForeignKey(() => RecipeVersion)
  public recipe_version_id: number

  @BelongsTo(() => Recipe)
  public recipe: Recipe

  @BelongsTo(() => RecipeVersion)
  public recipeVersion: RecipeVersion
}
