import { ProcedureLine, ProcedureLineJSON } from './procedure_line'
import { ProcedureList, ProcedureListJSON } from './procedure_list'

export interface ProcedureListLineJSON {
  procedure_list_id: number
  procedure_line_id: number
  procedureList: ProcedureListJSON
  procedureLine: ProcedureLineJSON
}

export class ProcedureListLine implements ProcedureListLineJSON {
  public procedure_list_id: number

  public procedure_line_id: number

  public sort_key: number

  public procedureList: ProcedureList

  public procedureLine: ProcedureLine
}
