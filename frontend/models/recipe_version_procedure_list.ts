import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript'

import { ProcedureList } from './procedure_list'
import { RecipeVersion } from './recipe_version'

@Table({
  tableName: 'recipe_version_procedure_lists'
})
export class RecipeVersionProcedureList extends Model<
  RecipeVersionProcedureList
> {
  @AllowNull(false)
  @Column
  @ForeignKey(() => RecipeVersion)
  public recipe_version_id: number

  @AllowNull(false)
  @Column
  @ForeignKey(() => ProcedureList)
  public procedure_list_id: number

  @Column public sort_key: number

  @BelongsTo(() => RecipeVersion)
  public recipeVersion: RecipeVersion

  @BelongsTo(() => ProcedureList)
  public procedureList: ProcedureList
}
