import { RecipeVersionPatch } from '../common/request-models'
import { Recipe, RecipeJSON } from './recipe'
import { RecipeVersion, RecipeVersionJSON } from './recipe_version'

export interface RecipeBranchJSON {
  recipe_id: number
  name: string
  recipe_version_id: number
  recipe: RecipeJSON
  recipeVersion: RecipeVersionJSON
}

export class RecipeBranch implements RecipeBranchJSON {
  public recipe_id: number

  public name: string

  public recipe_version_id: number

  public recipe: Recipe

  public recipeVersion: RecipeVersion

  public async applyPatch(
    _patch: RecipeVersionPatch,
    _userId: number
  ): Promise<RecipeBranch> {
    return null
  }
}
