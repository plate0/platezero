import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement
} from 'sequelize-typescript'

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true
})
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number

  @Column public email: string

  @Column public username: string
}
