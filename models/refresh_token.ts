import { randomBytes } from 'crypto'
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  Default,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt
} from 'sequelize-typescript'
import { User } from './user'

@Table({
  tableName: 'refresh_tokens'
})
export class RefreshToken extends Model<RefreshToken> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public declare id: number

  @AllowNull(false)
  @Column
  @ForeignKey(() => User)
  public user_id: number

  @AllowNull(false)
  @Unique
  @Default(() => randomBytes(64).toString('hex'))
  @Column
  public token: string

  @Column public last_used: Date

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
}
