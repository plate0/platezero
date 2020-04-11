import {
  AllowNull,
  Column,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

@Table({ tableName: 'user_activity' })
export class UserActivity extends Model<UserActivity> {
  @AllowNull(false)
  @PrimaryKey
  @Column
  public date: Date

  @AllowNull(false)
  @PrimaryKey
  @Column
  public user_id: number

  public static async record(user_id: number): Promise<void> {
    await UserActivity.sequelize.query(
      'insert into user_activity (date, user_id) values (now()::date, ?) on conflict do nothing',
      {
        replacements: [user_id],
        type: UserActivity.sequelize.QueryTypes.INSERT
      }
    )
  }
}
