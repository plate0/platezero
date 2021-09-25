import { RecipeVersionPatch } from '../common/request-models'
import { IngredientList } from './ingredient_list'
import { Preheat } from './preheat'
import { ProcedureList } from './procedure_list'
import { Recipe } from './recipe'
import { RecipeDuration } from './recipe_duration'
import { RecipeYield } from './recipe_yield'
import { User } from './user'

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

export class RecipeVersion implements RecipeVersionJSON {
  public declare id: number

  public recipe_id: number

  public created_at: Date

  public user_id: number

  public parent_recipe_version_id: number

  public recipe_yield_id: number

  public recipe_duration_id: number

  public message: string

  public recipe: Recipe

  public author: User

  public parentRecipeVersion: RecipeVersion

  public recipeYield: RecipeYield

  public recipeDuration: RecipeDuration

  public procedureLists: ProcedureList[]

  public ingredientLists: IngredientList[]

  public preheats: Preheat[]

  public static async createFromPrevious(
    _id: number,
    _patch: RecipeVersionPatch,
    _userId: number,
    _transaction?: any
  ): Promise<RecipeVersion> {
    return null
  }
}
