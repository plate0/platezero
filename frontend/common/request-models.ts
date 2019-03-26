import {
  IngredientListJSON,
  IngredientLineJSON,
  ProcedureListJSON,
  ProcedureLineJSON,
  PreheatJSON
} from '../models'
import { ItemPatch } from './changes'

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
  // patch info
  message: string

  // ingredient updates
  changedIngredientLists: ItemPatch<IngredientLineJSON>[]

  // procedure updates
  addedProcedureLists: ProcedureListJSON[]
  changedProcedureLists: ItemPatch<ProcedureLineJSON>[]
  removedProcedureListIds: number[]
}
