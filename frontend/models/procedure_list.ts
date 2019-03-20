import {
  AutoIncrement,
  Column,
  HasMany,
  BelongsToMany,
  Model,
  PrimaryKey,
  ICreateOptions,
  Table
} from 'sequelize-typescript'
import * as _ from 'lodash'

import { ProcedureListLine } from './procedure_list_line'
import { ProcedureLine, ProcedureLineJSON } from './procedure_line'
import { ProcedureListPatch } from '../common/request-models'

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
  public id: number

  @Column public name: string

  @HasMany(() => ProcedureListLine)
  public listLines: ProcedureListLine[]

  @BelongsToMany(() => ProcedureLine, () => ProcedureListLine)
  public lines: ProcedureLine[]

  public static async createWithLines(
    pl: ProcedureListJSON,
    options?: ICreateOptions
  ): Promise<ProcedureList> {
    const procedureList = await ProcedureList.create({ name: pl.name }, options)
    const lines = await Promise.all(
      _.map(pl.lines, ({ text, image_url, title }) =>
        ProcedureLine.create({ text, image_url, title }, options)
      )
    )
    await Promise.all(
      _.map(lines, (line, sort_key) =>
        ProcedureListLine.create(
          {
            procedure_list_id: procedureList.id,
            procedure_line_id: line.id,
            sort_key
          },
          options
        )
      )
    )
    return procedureList
  }

  public static async createFromPatch(
    patch: ProcedureListPatch,
    transaction?: any
  ): Promise<ProcedureList> {
    const id = patch.procedureListId
    const prev = await ProcedureList.findOne({
      where: { id },
      include: [{ model: ProcedureLine }],
      transaction
    })
    const list = await ProcedureList.create(
      { name: prev.name },
      { transaction }
    )
    await Promise.all(
      _.map(prev.lines, async (line, sort_key) => {
        const removed = !_.isUndefined(
          _.find(patch.removedStepIds, id => id === line.id)
        )
        if (removed) {
          return Promise.resolve()
        }
        const changed = _.find(patch.changedSteps, { id: line.id })
        if (!changed) {
          return ProcedureListLine.create(
            {
              procedure_list_id: list.id,
              procedure_line_id: line.id,
              sort_key
            },
            { transaction }
          )
        }
        console.log('will add changed step', changed)
        const newLine = await ProcedureLine.create(_.omit(changed, ['id']), {
          transaction
        })
        return ProcedureListLine.create(
          {
            procedure_list_id: list.id,
            procedure_line_id: newLine.id,
            sort_key
          },
          { transaction }
        )
      })
    )
    await Promise.all(
      _.map(patch.addedSteps, async (line, sort_key) => {
        const newLine = await ProcedureLine.create(_.omit(line, ['id']), {
          transaction
        })
        return ProcedureListLine.create(
          {
            procedure_list_id: list.id,
            procedure_line_id: newLine.id,
            sort_key: prev.lines.length + sort_key
          },
          { transaction }
        )
      })
    )
    return list
  }
}
