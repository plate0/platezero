import { ProcedureLine, ProcedureLineJSON } from './procedure_line'
import { ProcedureListLine } from './procedure_list_line'

export interface ProcedureListJSON {
  id?: number
  name?: string
  lines: ProcedureLineJSON[]
}

export class ProcedureList implements ProcedureListJSON {
  public declare id: number

  public name: string

  public listLines: ProcedureListLine[]

  public lines: ProcedureLine[]

  public static async createWithLines(
    _pl: ProcedureListJSON,
    _options?: any
  ): Promise<ProcedureList> {
    return null
  }

  public static async createAndLink(
    _lists: ProcedureListJSON[],
    _versionId: number
  ): Promise<ProcedureList[]> {
    return null
  }

  /**
   * Given a ProcedureListJSON, return a ProcedureListJSON based on the following:
   *
   * If the procedure list DOES NOT have an `id`:
   *
   *   1. Create a new procedure list
   *   2. For each line, check whether it has an id. If it does, simply link
   *      the existing line in the order specified by its array position. If
   *      it does not have an id, then a new line must be created with the
   *      specified properties.
   *
   * If the procedure list DOES have an id, simply return the procedure list
   * as queried from the database.
   */
  public static async findOrCreateWithLines(
    _patch: ProcedureListJSON,
    _transaction?: any
  ): Promise<ProcedureList> {
    return null
  }
}
