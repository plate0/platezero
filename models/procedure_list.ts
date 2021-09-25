import * as _ from 'lodash'
import {
  AutoIncrement,
  BelongsToMany,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { ProcedureLine, ProcedureLineJSON } from './procedure_line'
import { ProcedureListLine } from './procedure_list_line'
import { RecipeVersionProcedureList } from './recipe_version_procedure_list'

export interface ProcedureListJSON {
  id?: number
  name?: string
  lines: ProcedureLineJSON[]
}

@Table({
  tableName: 'procedure_lists'
})
export class ProcedureList extends Model<ProcedureList>
  implements ProcedureListJSON {
  @AutoIncrement
  @PrimaryKey
  @Column
  public declare id: number

  @Column public name: string

  @HasMany(() => ProcedureListLine)
  public listLines: ProcedureListLine[]

  @BelongsToMany(() => ProcedureLine, () => ProcedureListLine)
  public lines: ProcedureLine[]

  public static async createWithLines(
    pl: ProcedureListJSON,
    options?: any
  ): Promise<ProcedureList> {
    const procedureList: any = await ProcedureList.create(
      { name: pl.name } as any,
      options
    )
    const lines = await Promise.all(
      _.map(pl.lines, ({ text, image_url, title }) =>
        ProcedureLine.create({ text, image_url, title } as any, options)
      )
    )
    await Promise.all(
      _.map(lines, (line, sort_key) =>
        ProcedureListLine.create(
          {
            procedure_list_id: procedureList.id,
            procedure_line_id: line.id,
            sort_key
          } as any,
          options
        )
      )
    )
    return procedureList
  }

  public static async createAndLink(
    lists: ProcedureListJSON[],
    versionId: number
  ): Promise<ProcedureList[]> {
    return ProcedureList.sequelize.transaction(async (transaction) => {
      const procedureLists: any = await Promise.all(
        _.map(lists, (pl) => ProcedureList.createWithLines(pl, { transaction }))
      )
      await Promise.all(
        _.map(procedureLists, (pl, sort_key) =>
          RecipeVersionProcedureList.create(
            {
              recipe_version_id: versionId,
              procedure_list_id: pl.id,
              sort_key
            } as any,
            { transaction }
          )
        )
      )
      return procedureLists
    })
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
    patch: ProcedureListJSON,
    transaction?: any
  ): Promise<ProcedureList> {
    if (!_.isUndefined(patch.id)) {
      return await ProcedureList.findOne({
        where: { id: patch.id },
        include: [{ model: ProcedureLine }],
        transaction
      })
    }
    const list = await ProcedureList.create({ name: patch.name } as any, {
      transaction
    })
    const lines = _.map(patch.lines, async (line) => {
      if (!_.isUndefined(line.id)) {
        return await ProcedureLine.findOne({
          where: { id: line.id },
          transaction
        })
      }
      return await ProcedureLine.create(line, { transaction })
    })
    await Promise.all(
      _.map(
        lines,
        async (line, sort_key) =>
          await ProcedureListLine.create(
            {
              procedure_list_id: list.id,
              procedure_line_id: (await line).id,
              sort_key
            } as any,
            { transaction }
          )
      )
    )
    return list
  }
}
