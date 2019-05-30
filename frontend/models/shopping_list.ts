import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
  Column,
  Model,
  HasMany,
  PrimaryKey,
  Table,
  Unique
} from 'sequelize-typescript'
import { User } from './user'
import { ShoppingListItem, ShoppingListItemJSON } from './shopping_list_item'

export interface ShoppingListJSON {
  id?: number
  name: string
  items?: ShoppingListItemJSON[]
}

@Table({
  tableName: 'shopping_lists'
})
export class ShoppingList extends Model<ShoppingList> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @AllowNull(false)
  @Column
  @ForeignKey(() => User)
  public user_id: number

  @AllowNull(false)
  @Unique
  @Column
  public name: string

  @Column public created_at: Date

  @Column public updated_at: Date

  @Column public deleted_at: Date

  @BelongsTo(() => User)
  public user: User

  @HasMany(() => ShoppingListItem)
  public items: ShoppingListItem[]
}
