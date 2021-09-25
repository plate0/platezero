export interface ProcedureLineJSON {
  id?: number
  text: string
  image_url?: string
  title?: string
}

export class ProcedureLine implements ProcedureLineJSON {
  public declare id: number

  public text: string

  public image_url: string

  public title: string
}
