import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DefaultScope,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript'
import { Recipe, RecipeJSON } from './recipe'
import { User, UserJSON } from './user'

export interface FavoriteJSON {
  id?: number
  user_id: number
  recipe_id: number
  created_at?: Date | string
  updated_at?: Date | string
  user?: UserJSON
  recipe?: RecipeJSON
}

@DefaultScope({
  include: [{ model: () => User }, { model: () => Recipe }]
})
@Table({
  tableName: 'favorites',
  paranoid: false
})
export class Favorite extends Model<Favorite> implements FavoriteJSON {
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
  @CreatedAt
  public created_at: Date

  @Column
  @UpdatedAt
  public updated_at: Date

  @BelongsTo(() => User)
  public author: User

  @BelongsTo(() => Recipe)
  public recipe: Recipe
}
