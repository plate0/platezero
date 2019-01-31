import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

@Table({
  tableName: 'procedure_lists'
})
export class ProcedureList extends Model<ProcedureList> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @Column public name: string
}
