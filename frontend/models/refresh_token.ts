import { randomBytes } from 'crypto'
import {
  Default,
  AllowNull,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
  Column,
  Model,
  PrimaryKey,
  Table,
  Unique
} from 'sequelize-typescript'
import { User } from './user'

@Table({
  tableName: 'refresh_tokens'
})
export class RefreshToken extends Model<RefreshToken> {
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
  @Default(() => randomBytes(64).toString('hex'))
  @Column
  public token: string

  @Column public last_used: Date

  @Column public created_at: Date

  @Column public updated_at: Date

  @Column public deleted_at: Date

  @BelongsTo(() => User)
  public user: User
}
