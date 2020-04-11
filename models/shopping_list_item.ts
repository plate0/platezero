import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
  Column,
  Model,
  PrimaryKey,
  Table,
  CreatedAt,
  UpdatedAt,
  DeletedAt
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

  @Column
  @CreatedAt
  public created_at: Date

  @Column
  @UpdatedAt
  public updated_at: Date

  @Column
  @DeletedAt
  public deleted_at: Date

  @BelongsTo(() => ShoppingList)
  public shoppingList: ShoppingList
}
