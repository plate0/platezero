import {
  AllowNull,
  AutoIncrement,
  Column,
  Model,
  Table,
  PrimaryKey
} from 'sequelize-typescript'

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
}
