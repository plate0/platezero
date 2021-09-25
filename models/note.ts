import { Recipe, RecipeJSON } from './recipe'
import { RecipeVersion, RecipeVersionJSON } from './recipe_version'
import { User, UserJSON } from './user'

export interface NoteJSON {
  id?: number
  recipe_id: number
  recipe_version_id: number
  author_id?: number
  text: string
  pinned: boolean
  created_at?: Date | string
  updated_at?: Date | string
  deleted_at?: Date | string
  recipe?: RecipeJSON
  recipeVersion?: RecipeVersionJSON
  author?: UserJSON
}

export class Note implements NoteJSON {
  public declare id: number

  public recipe_id: number

  public recipe_version_id: number

  public author_id: number

  public text: string

  public pinned: boolean

  public created_at: Date

  public updated_at: Date

  public deleted_at: Date

  public author: User

  public recipe: Recipe

  public recipeVersion: RecipeVersion
}
