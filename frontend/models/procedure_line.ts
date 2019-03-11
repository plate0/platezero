import {
  AllowNull,
  AutoIncrement,
  Column,
  Model,
  Table,
  PrimaryKey
} from 'sequelize-typescript'

export interface ProcedureLineJSON {
  id?: number
  text: string
  image_url?: string
  title?: string
}

@Table({
  tableName: 'procedure_lines'
})
export class ProcedureLine extends Model<ProcedureLine> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @AllowNull(false)
  @Column
  public text: string

  @Column
  public image_url: string

  @Column
  public title: string
}
