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
  public steps: ProcedureLine[]

  public static async createWithSteps(
    pl: ProcedureListJSON,
    options?: ICreateOptions
  ): Promise<ProcedureList> {
    const procedureList = await ProcedureList.create({ name: pl.name }, options)
    const steps = await Promise.all(
      _.map(pl.steps, ({ text, image_url, title }) =>
        ProcedureLine.create({ text, image_url, title }, options)
      )
    )
    await Promise.all(
      _.map(steps, (line, sort_key) =>
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
