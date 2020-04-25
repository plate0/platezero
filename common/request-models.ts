import {
  IngredientListJSON,
  PreheatJSON,
  ProcedureListJSON,
  RecipeDurationJSON,
  RecipeYieldJSON,
} from '../models'

export interface PostRecipe {
  title: string
  subtitle?: string
  description?: string
  image_url?: string
  source_url?: string
  source_author?: string
  source_title?: string
  source_isbn?: string
  html_url?: string
  yield?: string
  duration?: number
  preheats?: PreheatJSON[]
  ingredient_lists?: IngredientListJSON[]
  procedure_lists?: ProcedureListJSON[]
}

export interface RecipeVersionPatch {
  message: string
  ingredientLists: IngredientListJSON[]
  procedureLists: ProcedureListJSON[]
  preheats: PreheatJSON[]
  recipeDuration: RecipeDurationJSON
  recipeYield: RecipeYieldJSON
}

export interface NotePatch {
  pinned?: boolean
  text?: string
}
