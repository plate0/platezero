import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { ProfileQuestion } from './profile_question'
import { User } from './user'
import { Family } from './family'
import { get } from 'lodash'

export interface UserProfileJSON {
  id?: number
  user_id: number
  question_id: number
  answer: string
}

export type UserProfileFullJSON = ProfileQuestion[]

@Table({
  tableName: 'users_profile'
})
export class UserProfile extends Model<UserProfile> implements UserProfileJSON {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @Column
  @ForeignKey(() => User)
  public user_id: number

  @Column
  @ForeignKey(() => Family)
  public family_id: number

  @AllowNull(false)
  @Column
  public question_id: number

  @AllowNull(false)
  @Column
  public answer: string

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

  @BelongsTo(() => User)
  public user: User

  @BelongsTo(() => Family)
  public family: Family

  public static async findFor({
    user_id,
    family_id
  }: {
    user_id?: number
    family_id?: number
  }): Promise<ProfileQuestion[]> {
    let where: any = { is_family: !!family_id }
    const questions = await ProfileQuestion.findAll({
      where,
      order: [['priority', 'ASC'], ['sort', 'ASC']]
    })
    const answers = {}
    where = family_id ? ({ family_id } as any) : ({ user_id } as any)
    ;(await UserProfile.findAll({
      where
    })).forEach(a => (answers[a.question_id] = a.get()))
    return questions.map(q => ({
      ...q.get(),
      answer: get(answers, `${q.id}.answer`),
      answer_id: get(answers, `${q.id}.id`)
    }))
  }
}
