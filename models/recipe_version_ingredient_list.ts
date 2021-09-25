import { IngredientList } from './ingredient_list'
import { RecipeVersion } from './recipe_version'

export class RecipeVersionIngredientList {
  public recipe_version_id: number

  public ingredient_list_id: number

  public sort_key: number

  public recipeVersion: RecipeVersion

  public ingredientList: IngredientList
}
