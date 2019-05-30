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
  Unique,
  CreatedAt,
  UpdatedAt,
  DeletedAt
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
  public user: User

  @HasMany(() => ShoppingListItem)
  public items: ShoppingListItem[]
}
