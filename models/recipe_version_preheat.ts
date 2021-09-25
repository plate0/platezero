export interface RecipeVersionPreheatJSON {
  recipe_version_id: number
  preheat_id: number
}

export class RecipeVersionPreheat implements RecipeVersionPreheatJSON {
  public recipe_version_id: number

  public preheat_id: number
}
