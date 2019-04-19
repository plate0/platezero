export const RecipeParts = [
  { name: 'Title', val: 'title', key: 't' },
  { name: 'Subtitle', val: 'subtitle', key: 's' },
  { name: 'Description', val: 'description', key: 'd' },
  { name: 'Ingredients', val: 'ingredients', key: 'i' },
  { name: 'Procudure', val: 'procedures', key: 'o' },
  { name: 'Yield', val: 'yld', key: 'y' },
  { name: 'Duration', val: 'duration', key: 'u' }
]

export interface PreheatJSON {
  name: string
  temperature: number
  unit: string
}

export interface IngredientLineJSON {
  name: string
  quantity_numerator?: number
  quantity_denominator?: number
  preparation?: string
  optional: boolean
  unit?: string
}

export interface IngredientListJSON {
  lines: IngredientLineJSON[]
  image_url?: string
  name?: string
}

export interface ProcedureLinesJSON {
  text: string
  image_url?: string
  title?: string
}

export interface ProcedureListJSON {
  name?: string
  lines: ProcedureLinesJSON[]
}

export interface Recipe {
  title: string
  subtitle?: string
  description?: string
  yield?: string
  duration?: number
  preheats?: PreheatJSON[]
  ingredient_lists: IngredientListJSON[]
  procedure_lists: ProcedureListJSON[]
}

export interface MarkdownRecipe {
  title: string
  subtitle?: string
  description?: string
  yld?: string
  duration?: number
  preheats?: string
  ingredients: string
  procedures: string
}
