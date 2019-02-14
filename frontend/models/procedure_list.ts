import {
  AutoIncrement,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

import { ProcedureListLine } from './procedure_list_line'

@Table({
  tableName: 'procedure_lists'
})
export class ProcedureList extends Model<ProcedureList> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @Column public name: string

  @HasMany(() => ProcedureListLine)
  public lines: ProcedureListLine[]
}
