import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  PrimaryKey,
  Model,
  Table
} from 'sequelize-typescript'

import { Recipe } from './recipe'
import { User } from './user'

@Table({
  tableName: 'recipe_collaborators'
})
export class RecipeCollaborator extends Model<RecipeCollaborator> {
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
  @ForeignKey(() => User)
  public user_id: number

  @AllowNull(false)
  @Default(false)
  @Column
  public accepted: boolean

  @BelongsTo(() => Recipe)
  public recipe: Recipe

  @BelongsTo(() => User)
  public user: User
}
