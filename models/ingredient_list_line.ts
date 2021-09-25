export interface IngredientListLineJSON {
  ingredient_list_id: number
  ingredient_line_id: number
}

export class IngredientListLine implements IngredientListLineJSON {
  public ingredient_list_id: number

  public ingredient_line_id: number

  public sort_key: number
}
