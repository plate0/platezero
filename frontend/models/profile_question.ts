import {
  AllowNull,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Column,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

export interface ProfileQuestionJSON {
  id?: number
  question: string
  section: string
  priority: number
  sort: number
  type: string
  answer?: string
  answer_id?: number
}

@Table({
  tableName: 'profile_questions'
})
export class ProfileQuestion extends Model<ProfileQuestion>
  implements ProfileQuestionJSON {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @AllowNull(false)
  @Column
  public question: string

  @AllowNull(true)
  @Column
  public help_text: string

  @AllowNull(false)
  @Column
  public section: string

  @AllowNull(false)
  @Column
  public priority: number

  @AllowNull(false)
  @Column
  public sort: number

  @AllowNull(false)
  @Column
  public type: string

  @AllowNull(false)
  @Column
  public is_family: boolean

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
}
