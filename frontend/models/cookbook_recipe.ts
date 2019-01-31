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

import { Cookbook } from './cookbook'

@Table({
  tableName: 'cookbook_recipes'
})
export class CookbookRecipe extends Model<CookbookRecipe> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @AllowNull(false)
  @Column
  @ForeignKey(() => Cookbook)
  public cookbook_id: number

  @AllowNull(false)
  @Column
  public page: string

  @AllowNull(false)
  @Column
  public title: string

  @BelongsTo(() => Cookbook)
  public cookbook: Cookbook
}

