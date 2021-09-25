export interface RecipeDurationJSON {
  id?: number
  duration_seconds: number
}

export class RecipeDuration implements RecipeDurationJSON {
  public declare id: number

  public duration_seconds: number
}
