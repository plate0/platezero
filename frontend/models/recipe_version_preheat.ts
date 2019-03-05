import {
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
  Table
} from 'sequelize-typescript'

import { RecipeVersion } from './recipe_version'
import { Preheat } from './preheat'

@Table({
  tableName: 'recipe_version_preheats'
})
export class RecipeVersionPreheat extends Model<RecipeVersionPreheat> {
  @PrimaryKey
  @ForeignKey(() => RecipeVersion)
  @Column
  public recipe_version_id: number

  @PrimaryKey
  @ForeignKey(() => Preheat)
  @Column
  public preheat_id: number
}
