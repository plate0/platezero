import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
  Column,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { ShoppingList } from './shopping_list'

export interface ShoppingListItemJSON {
  id?: number
  name: string
  completed: boolean
}

@Table({
  tableName: 'shopping_list_items'
})
export class ShoppingListItem extends Model<ShoppingListItem> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @AllowNull(false)
  @Column
  @ForeignKey(() => ShoppingList)
  public shopping_list_id: number

  @AllowNull(false)
  @Column
  public name: string

  @Column
  public completed: boolean

  @Column public created_at: Date

  @Column public updated_at: Date

  @Column public deleted_at: Date

  @BelongsTo(() => ShoppingList)
  public shoppingList: ShoppingList
}
