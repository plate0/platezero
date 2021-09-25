export interface PreheatJSON {
  id?: number
  name: string
  temperature: number
  unit: string
}

export class Preheat implements PreheatJSON {
  public declare id: number

  public name: string

  public temperature: number

  public unit: string
}
