import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import * as _ from 'lodash'
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  Is,
  IsEmail,
  Model,
  PrimaryKey,
  Table,
  Unique
} from 'sequelize-typescript'
import { Recipe, RecipeJSON } from './recipe'
import { RefreshToken } from './refresh_token'

export interface UserJSON {
  avatar_url: string
  email?: string
  id: number
  name: string
  recipes?: RecipeJSON[]
  username: string
  email_opt_out: boolean
}

@Table({
  tableName: 'users'
})
export class User extends Model<User> implements UserJSON {
  @AutoIncrement
  @PrimaryKey
  @Column
  public declare id: number

  @AllowNull(false)
  @Unique
  @Is('Username', (value) => {
    if (!/[a-zA-Z0-9][a-zA-Z0-9_\-]{1,31}/.test(value)) {
      throw new Error(`"${value}" is not a valid username.`)
    }
  })
  @Column
  public username: string

  @AllowNull(false)
  @Unique
  @IsEmail
  @Column
  public set email(value: string) {
    this.setDataValue('email', value)
  }

  public get email() {
    return undefined
  }

  @Column
  public set password_hash(value: string) {
    this.setDataValue('password_hash', value)
  }

  public get password_hash() {
    return undefined
  }

  @Column public avatar_url: string

  @Column public confirmed_at: Date

  @Column public created_at: Date

  @Column public updated_at: Date

  @Column public deleted_at: Date

  @Column public name: string

  @Column public email_opt_out: boolean

  @HasMany(() => Recipe)
  public recipes: Recipe[]

  @HasMany(() => RefreshToken)
  public refresh_tokens: RefreshToken[]

  @Column(DataType.VIRTUAL)
  public get url(): string {
    return `${process.env.API_URL}/users/${this.username}`
  }

  @Column(DataType.VIRTUAL)
  public get html_url(): string {
    return `${process.env.SITE_URL}/${this.username}`
  }

  @Column(DataType.VIRTUAL)
  public get recipes_url(): string {
    return `${process.env.API_URL}/users/${this.username}/recipes`
  }

  @Column(DataType.VIRTUAL)
  public get recipes_html_url(): string {
    return `${process.env.SITE_URL}/${this.username}/recipes`
  }

  public async setPassword(newPassword: string) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(newPassword, 12, (err, hash) => {
        if (err) {
          return reject(err)
        }
        this.password_hash = hash
        return resolve(true)
      })
    })
  }

  public async checkPassword(candidate: string) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(
        candidate,
        this.getDataValue('password_hash'),
        (err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve(res)
        }
      )
    })
  }

  public async generateToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { userId: this.id, username: this.username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' },
        (err, token) => {
          if (err) {
            return reject(err)
          }
          return resolve(token)
        }
      )
    })
  }

  public static async findByUsername(username: string): Promise<User> {
    if (_.isUndefined(username)) {
      throw new Error('username is undefined')
    }
    const { where, fn, col } = User.sequelize as any
    return User.findOne({
      where: where(fn('lower', col('username')), username.toLowerCase())
    })
  }
}
