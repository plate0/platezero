import {
  Column,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript'

import { Author } from './author'
import { Cookbook } from './cookbook'

@Table({
  tableName: 'cookbook_authors'
})
export class CookbookAuthor extends Model<CookbookAuthor> {
  @Column
  @ForeignKey(() => Author)
  public author_id: number

  @Column
  @ForeignKey(() => Cookbook)
  public cookbook_id: number
}
