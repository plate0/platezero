import {
  IngredientListJSON,
  IngredientLineJSON,
  ProcedureListJSON,
  ProcedureLineJSON,
  PreheatJSON
} from '../models'

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

export interface IngredientListPatch {
  ingredientListId: number
  removedIngredientIds: number[]
  changedIngredients: IngredientLineJSON[]
  addedIngredients: IngredientLineJSON[]
}

export interface ProcedureListPatch {
  procedureListId: number
  removedStepIds: number[]
  changedSteps: ProcedureLineJSON[]
  addedSteps: ProcedureLineJSON[]
}

export interface RecipeVersionPatch {
  // patch info
  message: string

  // ingredient updates
  changedIngredientLists: IngredientListPatch[]

  // procedure updates
  addedProcedureLists: ProcedureListJSON[]
  changedProcedureLists: ProcedureListPatch[]
  removedProcedureListIds: number[]
}
