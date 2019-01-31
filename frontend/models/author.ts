import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

import { Cookbook } from './cookbook'
import { CookbookAuthor } from './cookbook_author'

@Table({
  tableName: 'authors'
})
export class Author extends Model<Author> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number

  @AllowNull(false)
  @Column
  public name: string

  @BelongsToMany(() => Cookbook, () => CookbookAuthor)
  cookbooks: Cookbook[]
}
