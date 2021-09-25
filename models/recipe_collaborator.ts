import { Recipe, RecipeJSON } from './recipe'
import { User, UserJSON } from './user'

export interface RecipeCollaboratorJSON {
  id?: number
  recipe_id: number
  user_id: number
  accepted: boolean
  recipe: RecipeJSON
  user: UserJSON
}

export class RecipeCollaborator implements RecipeCollaboratorJSON {
  public declare id: number

  public recipe_id: number

  public user_id: number

  public accepted: boolean

  public recipe: Recipe

  public user: User
}
