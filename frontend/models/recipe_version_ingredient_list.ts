import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript'

import { IngredientList} from './ingredient_list'
import { RecipeVersion } from './recipe_version'

@Table({
  tableName: 'recipe_version_ingredient_lists'
})
export class RecipeVersionIngredientList extends Model<
  RecipeVersionIngredientList
> {
  @AllowNull(false)
  @Column
  @ForeignKey(() => RecipeVersion)
  public recipe_version_id: number

  @AllowNull(false)
  @Column
  @ForeignKey(() => IngredientList)
  public ingredient_list_id: number

  @Column public sort_key: number

  @BelongsTo(() => RecipeVersion)
  public recipeVersion: RecipeVersion

  @BelongsTo(() => IngredientList)
  public ingredientList: IngredientList
}
