import {
  AllowNull,
  BelongsTo,
  Column,
  PrimaryKey,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript'
import * as _ from 'lodash'

import { RecipeVersion, RecipeVersionJSON } from './recipe_version'
import { Recipe, RecipeJSON } from './recipe'
import { RecipeVersionPatch } from '../common/request-models'

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
export class RecipeBranch extends Model<RecipeBranch>
  implements RecipeBranchJSON {
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

  public async applyPatch(
    patch: RecipeVersionPatch,
    userId: number
  ): Promise<RecipeBranch> {
    return await RecipeBranch.sequelize.transaction(async (transaction) => {
      const prevId = this.get('recipe_version_id')
      const newVersion = await RecipeVersion.createFromPrevious(
        prevId,
        patch,
        userId,
        transaction
      )
      return this.update({ recipe_version_id: newVersion.id }, { transaction })
    })
  }
}
