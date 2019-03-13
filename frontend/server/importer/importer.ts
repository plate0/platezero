import { RecipeJSON } from '../../models'

export interface Importer {
  recipe(): Promise<RecipeJSON>
}
