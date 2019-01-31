import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript'

import { RecipeVersion } from './recipe_version'
import { Recipe } from './recipe'

@Table({
  tableName: 'recipe_branches'
})
export class RecipeBranch extends Model<RecipeBranch> {
  @AllowNull(false)
  @Column
  @ForeignKey(() => Recipe)
  public recipe_id: number

  @AllowNull(false)
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
