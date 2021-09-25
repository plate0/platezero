import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { Recipe, RecipeJSON } from './recipe'
import { User, UserJSON } from './user'

export interface RecipeCollaboratorJSON {
  id?: number
  recipe_id: number
  user_id: number
  accepted: boolean
  recipe: RecipeJSON
  user: UserJSON
}

@Table({
  tableName: 'recipe_collaborators'
})
export class RecipeCollaborator extends Model<RecipeCollaborator>
  implements RecipeCollaboratorJSON {
  @AutoIncrement
  @PrimaryKey
  @Column
  public declare id: number

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
