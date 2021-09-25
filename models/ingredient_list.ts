import { IngredientLine, IngredientLineJSON } from './ingredient_line'

export interface IngredientListJSON {
  id?: number
  lines: IngredientLineJSON[]
  image_url?: string
  name?: string
}

export class IngredientList implements IngredientListJSON {
  public declare id: number

  public name: string

  public image_url: string

  public lines: IngredientLine[]

  public static async createWithIngredients(
    _il: IngredientListJSON,
    _options?: any
  ): Promise<IngredientList> {
    return null
  }

  public static async createAndLink(
    _lists: IngredientListJSON[],
    _versionId: number
  ): Promise<IngredientList[]> {
    return null
  }

  /**
   * Given an IngredientListJSON, return an IngredientListJSON based on the following:
   *
   * If the ingredient list DOES NOT have an `id`:
   *
   *   1. Create a new ingredient list
   *   2. For each ingredient, check whether it has an id. If it does, simply
   *      link the existing ingredient in the order specified by its array
   *      position. If it does not have an id, then a new line must be created
   *      with the specified properties.
   *
   * If the ingredient list DOES have an id, simply return the ingredient list
   * as queried from the database.
   */
  public static async findOrCreateWithIngredients(
    _patch: IngredientListJSON,
    _transaction?: any
  ): Promise<IngredientList> {
    return null
  }
}
