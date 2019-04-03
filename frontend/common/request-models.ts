import { IngredientListJSON, ProcedureListJSON, PreheatJSON } from '../models'

export interface PostRecipe {
  title: string
  subtitle?: string
  description?: string
  image_url?: string
  source_url?: string
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
}
