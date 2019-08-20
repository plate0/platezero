import {
  AllowNull,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  DataType,
  DeletedAt,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { User } from './user'
import { ProfileQuestionJSON } from './profile_question'

export interface FamilyJSON {
  id?: number
  created_at?: Date | string
  updated_at?: Date | string
  deleted_at?: Date | string
  users: any
  profile: ProfileQuestionJSON[]
}

@Table({
  tableName: 'families'
})
export class Family extends Model<Family> implements FamilyJSON {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @AllowNull(false)
  @Column
  @CreatedAt
  public created_at: Date

  @Column
  @UpdatedAt
  public updated_at: Date

  @Column
  @DeletedAt
  public deleted_at: Date

  @Column(DataType.VIRTUAL)
  public profile: any

  @HasMany(() => User)
  public users: User[]
}
