import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  HasMany,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

import { CookbookRecipe } from './cookbook_recipe'
import { User } from './user'
import { RecipeBranch } from './recipe_branch'

@Table({
  tableName: 'recipes'
})
export class Recipe extends Model<Recipe> {
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
  public slug: string

  @AllowNull(false)
  @Column
  public title: string

  @Column
  public image_url: string

  @Column public source_url: string

  @Column
  @ForeignKey(() => CookbookRecipe)
  public source_cookbook_recipe_id: number

  @AllowNull(false)
  @Column
  public created_at: Date

  @Column public updated_at: Date

  @Column public deleted_at: Date

  @BelongsTo(() => User)
  public user: User

  @BelongsTo(() => CookbookRecipe)
  public cookbookRecipe: CookbookRecipe

  @HasMany(() => RecipeBranch)
  public branches: RecipeBranch[]
}
