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

export interface ProcedureListJSON {
  name?: string
  steps: ProcedureLineJSON[]
  time?: number
}

@Table({
  tableName: 'procedure_lists'
})
export class ProcedureList extends Model<ProcedureList> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @Column public name: string

  @Column public time: number

  @HasMany(() => ProcedureListLine)
  public listLines: ProcedureListLine[]

  @BelongsToMany(() => ProcedureLine, () => ProcedureListLine)
  public lines: ProcedureLine[]

  public static async createWithSteps(
    pl: ProcedureListJSON,
    options?: ICreateOptions
  ): Promise<ProcedureList> {
    const procedureList = await ProcedureList.create(
      { name: pl.name, time: pl.time },
      options
    )
    const lines = await Promise.all(
      _.map(pl.steps, ({ text, image_url, title }) =>
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
}
