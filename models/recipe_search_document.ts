import { Recipe, RecipeJSON } from './recipe'
import { User } from './user'

export interface RecipeSearchDocumentJSON {
  recipe: RecipeJSON
}

/**
 * Recipe Search Document
 *
 * WARNING: This is not really a table, it is a view! Do not try to insert,
 * update, or delete records!
 *
 * Effectively, this crunches together the recipe's title, description,
 * ingredients, and procedures and creates a full-text search index which can
 * be used to find recipes which match a plain text query. See
 * ../../db/migrate/04_recipe_search.sql for its definition and inner workings.
 *
 * This model only exists for nice interoperability with Sequelize, such as
 * being able to do `findAll` and `include` the Recipe model.
 */
export class RecipeSearchDocument implements RecipeSearchDocumentJSON {
  public recipe_id: number

  public user_id: number

  public doc: string

  public recipe: Recipe

  public user: User
}
