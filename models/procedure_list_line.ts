import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  PrimaryKey,
  Model,
  Table
} from 'sequelize-typescript'

import { ProcedureLine, ProcedureLineJSON } from './procedure_line'
import { ProcedureList, ProcedureListJSON } from './procedure_list'

export interface ProcedureListLineJSON {
  procedure_list_id: number
  procedure_line_id: number
  procedureList: ProcedureListJSON
  procedureLine: ProcedureLineJSON
}

@Table({
  tableName: 'procedure_list_lines'
})
export class ProcedureListLine extends Model<ProcedureListLine>
  implements ProcedureListLineJSON {
  @AllowNull(false)
  @PrimaryKey
  @Column
  @ForeignKey(() => ProcedureList)
  public procedure_list_id: number

  @AllowNull(false)
  @PrimaryKey
  @Column
  @ForeignKey(() => ProcedureLine)
  public procedure_line_id: number

  @Column public sort_key: number

  @BelongsTo(() => ProcedureList)
  public procedureList: ProcedureList

  @BelongsTo(() => ProcedureLine)
  public procedureLine: ProcedureLine
}
