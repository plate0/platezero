import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  Default,
  DefaultScope,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript'
import { Recipe, RecipeJSON } from './recipe'
import { RecipeVersion, RecipeVersionJSON } from './recipe_version'
import { User, UserJSON } from './user'

export interface NoteJSON {
  id?: number
  recipe_id: number
  recipe_version_id: number
  author_id?: number
  text: string
  pinned: boolean
  created_at?: Date | string
  updated_at?: Date | string
  deleted_at?: Date | string
  recipe?: RecipeJSON
  recipeVersion?: RecipeVersionJSON
  author?: UserJSON
}

@DefaultScope({
  include: [{ model: () => User }]
})
@Table({
  tableName: 'notes'
})
export class Note extends Model<Note> implements NoteJSON {
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
  @ForeignKey(() => RecipeVersion)
  public recipe_version_id: number

  @AllowNull(false)
  @Column
  @ForeignKey(() => User)
  public author_id: number

  @AllowNull(false)
  @Column
  public text: string

  @AllowNull(false)
  @Default(false)
  @Column
  public pinned: boolean

  @AllowNull(false)
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
  public author: User

  @BelongsTo(() => Recipe)
  public recipe: Recipe

  @BelongsTo(() => RecipeVersion)
  public recipeVersion: RecipeVersion
}
