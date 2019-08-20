import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
  Column,
  Model,
  PrimaryKey,
  Table,
  CreatedAt,
  UpdatedAt,
  DeletedAt
} from 'sequelize-typescript'
import { User, UserJSON } from './user'
import { Recipe, RecipeJSON } from './recipe'

export interface PlannedRecipeJSON {
  id?: number
  user_id: number
  recipe_id: number
  plan_date: Date
  user?: UserJSON
  recipe?: RecipeJSON
}

@Table({
  tableName: 'planned_recipes'
})
export class PlannedRecipe extends Model<PlannedRecipe> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @AllowNull(false)
  @Column
  @ForeignKey(() => User)
  public user_id: number

  @AllowNull(false)
  @Column
  @ForeignKey(() => Recipe)
  public recipe_id: number

  @AllowNull(false)
  @Column
  public plan_date: Date

  @Column
  @CreatedAt
  public created_at: Date

  @Column
  @UpdatedAt
  public updated_at: Date

  @Column
  @DeletedAt
  public deleted_at: Date

  @BelongsTo(() => User)
  public user: User

  @BelongsTo(() => Recipe)
  public recipe: Recipe
}
