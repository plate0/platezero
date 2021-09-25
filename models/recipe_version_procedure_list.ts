import { ProcedureList } from './procedure_list'
import { RecipeVersion } from './recipe_version'

export class RecipeVersionProcedureList {
  public recipe_version_id: number

  public procedure_list_id: number

  public sort_key: number

  public recipeVersion: RecipeVersion

  public procedureList: ProcedureList
}
