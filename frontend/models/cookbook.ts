import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique
} from 'sequelize-typescript'

import { Author } from './author'
import { CookbookAuthor } from './cookbook_author'
import { CookbookRecipe } from './cookbook_recipe'

@Table({
  tableName: 'cookbooks'
})
export class Cookbook extends Model<Cookbook> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @AllowNull(false)
  @Column
  public title: string

  @AllowNull(false)
  @Unique
  @Column
  public isbn: string

  @HasMany(() => CookbookRecipe)
  public recipes: CookbookRecipe[]

  @BelongsToMany(() => Author, () => CookbookAuthor)
  public authors: Author[]
}
