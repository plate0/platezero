import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Is,
  IsEmail,
  Model,
  HasMany,
  PrimaryKey,
  Table,
  Unique
} from 'sequelize-typescript'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'
import * as _ from 'lodash'

import { Recipe, RecipeJSON } from './recipe'
import { getConfig } from '../server/config'

const cfg = getConfig()

export interface UserJSON {
  avatar_url: string
  email: string
  id: number
  name: string
  recipes?: RecipeJSON[]
  username: string
}

@Table({
  tableName: 'users'
})
export class User extends Model<User> implements UserJSON {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @AllowNull(false)
  @Unique
  @Is('Username', value => {
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
  public email: string

  @Column
  public set password_hash(value: string) {
    this.setDataValue('password_hash', value)
  }

  public get password_hash() {
    return undefined
  }

  @Column
  public get avatar_url(): string {
    const dv = this.getDataValue('avatar_url')
    if (!dv) {
      const emailHash = crypto.createHash('md5')
      emailHash.update(this.email.toLowerCase())
      const hex = emailHash.digest('hex')
      return `https://www.gravatar.com/avatar/${hex}`
    }
    return dv
  }

  public set avatar_url(value: string) {
    this.setDataValue('avatar_url', value)
  }

  @Column public confirmed_at: Date

  @Column public created_at: Date

  @Column public updated_at: Date

  @Column public deleted_at: Date

  @Column public name: string

  @HasMany(() => Recipe)
  public recipes: Recipe[]

  @Column(DataType.VIRTUAL)
  public get url(): string {
    return `${cfg.apiUrl}/users/${this.username}`
  }

  @Column(DataType.VIRTUAL)
  public get html_url(): string {
    return `${cfg.siteUrl}/${this.username}`
  }

  @Column(DataType.VIRTUAL)
  public get recipes_url(): string {
    return `${cfg.apiUrl}/users/${this.username}/recipes`
  }

  @Column(DataType.VIRTUAL)
  public get recipes_html_url(): string {
    return `${cfg.siteUrl}/${this.username}/recipes`
  }

  public async setPassword(newPassword: string) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(newPassword, cfg.bcryptRounds, (err, hash) => {
        if (err) {
          return reject(err)
        }
        this.password_hash = hash
        return resolve()
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
        cfg.jwtSecret,
        { expiresIn: '7d' },
        (err, token) => {
          if (err) {
            return reject(err)
          }
          return resolve(token)
        }
      )
    })
  }
}
