export interface IngredientLineJSON {
  id?: number
  name: string
  quantity_numerator?: number
  quantity_denominator?: number
  preparation?: string
  optional: boolean
  unit?: string
}

export class IngredientLine implements IngredientLineJSON {
  public declare id: number

  public name: string

  public quantity_numerator: number

  public quantity_denominator: number

  public preparation: string

  public unit: string

  public optional: boolean
}
