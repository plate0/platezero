import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  PrimaryKey,
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
  @PrimaryKey
  @Column
  @ForeignKey(() => RecipeVersion)
  public recipe_version_id: number

  @AllowNull(false)
  @PrimaryKey
  @Column
  @ForeignKey(() => ProcedureList)
  public procedure_list_id: number

  @Column public sort_key: number

  @BelongsTo(() => RecipeVersion)
  public recipeVersion: RecipeVersion

  @BelongsTo(() => ProcedureList)
  public procedureList: ProcedureList
}
