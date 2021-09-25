import { Recipe, RecipeJSON } from './recipe'
import { User, UserJSON } from './user'

export interface FavoriteJSON {
  id?: number
  user_id: number
  recipe_id: number
  created_at?: Date | string
  updated_at?: Date | string
  user?: UserJSON
  recipe?: RecipeJSON
}

export class Favorite implements FavoriteJSON {
  public declare id: number

  public user_id: number

  public recipe_id: number

  public created_at: Date

  public updated_at: Date

  public author: User

  public recipe: Recipe
}
