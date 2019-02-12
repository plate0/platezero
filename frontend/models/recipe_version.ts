import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

import { OvenPreheat } from './oven_preheat'
import { RecipeYield } from './recipe_yield'
import { Recipe } from './recipe'
import { SousVidePreheat } from './sous_vide_preheat'
import { User } from './user'

@Table({
  tableName: 'recipe_versions'
})
export class RecipeVersion extends Model<RecipeVersion> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @AllowNull(false)
  @Column
  @ForeignKey(() => Recipe)
  public recipe_id: number

  @AllowNull(false)
  @Column
  public created_at: Date

  @AllowNull(false)
  @Column
  @ForeignKey(() => User)
  public user_id: number

  @Column
  @ForeignKey(() => RecipeVersion)
  public parent_recipe_version_id: number

  @Column
  @ForeignKey(() => RecipeYield)
  public recipe_yield_id: number

  @Column
  @ForeignKey(() => OvenPreheat)
  public oven_preheat_id: number

  @Column
  @ForeignKey(() => SousVidePreheat)
  public sous_vide_preheat_id: number

  @AllowNull(false)
  @Column
  public message: string

  @BelongsTo(() => Recipe)
  public recipe: Recipe

  @BelongsTo(() => User)
  public user: User

  @BelongsTo(() => RecipeVersion)
  public parentRecipeVersion: RecipeVersion

  @BelongsTo(() => RecipeYield)
  public recipeYield: RecipeYield

  @BelongsTo(() => OvenPreheat)
  public ovenPreheat: OvenPreheat

  @BelongsTo(() => SousVidePreheat)
  public sousVidePreheat: SousVidePreheat
}