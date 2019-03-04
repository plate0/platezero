import {
  AllowNull,
  AutoIncrement,
  Column,
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

import { Recipe } from './recipe'
import { getConfig } from '../server/config'

const cfg = getConfig()

@Table({
  tableName: 'users'
})
export class User extends Model<User> {
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

  @Column public password_hash: string

  @Column public avatar_url: string

  @Column public confirmed_at: Date

  @Column public created_at: Date

  @Column public updated_at: Date

  @Column public deleted_at: Date

  @Column public name: string

  @HasMany(() => Recipe)
  public recipes: Recipe[]

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
      bcrypt.compare(candidate, this.password_hash, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  public toJSON(): object {
    const values = Object.assign({}, this.get())
    delete values.password_hash
    values.url = `${cfg.apiUrl}/users/${values.username}`
    values.html_url = `${cfg.siteUrl}/${values.username}`
    values.recipes_url = `${cfg.apiUrl}/users/${values.username}/recipes`
    values.recipes_html_url = `${cfg.siteUrl}/${values.username}/recipes`
    if (!values.avatar_url) {
      const emailHash = crypto.createHash('md5')
      emailHash.update(values.email.toLowerCase())
      values.avatar_url = `https://www.gravatar.com/avatar/${emailHash.digest(
        'hex'
      )}`
    }
    return values
  }

  public async generateToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { userId: this.id, username: this.username },
        cfg.jwtSecret,
        { expiresIn: '24h' },
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
