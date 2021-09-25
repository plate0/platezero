export interface RecipeYieldJSON {
  id?: number
  text: string
}

export class RecipeYield implements RecipeYieldJSON {
  public declare id: number

  public text: string
}
