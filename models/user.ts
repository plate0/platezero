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

export class User implements UserJSON {
  public declare id: number

  public username: string

  public set email(value: string) {
    this.email = value
    //    this.setDataValue('email', value)
  }

  public get email() {
    return undefined
  }

  public set password_hash(_value: string) {
    //  this.setDataValue('password_hash', value)
  }

  public get password_hash() {
    return undefined
  }

  public avatar_url: string

  public confirmed_at: Date

  public created_at: Date

  public updated_at: Date

  public deleted_at: Date

  public name: string

  public email_opt_out: boolean

  public recipes: Recipe[]

  public refresh_tokens: RefreshToken[]

  public get url(): string {
    return `${process.env.API_URL}/users/${this.username}`
  }

  public get html_url(): string {
    return `${process.env.SITE_URL}/${this.username}`
  }

  public get recipes_url(): string {
    return `${process.env.API_URL}/users/${this.username}/recipes`
  }

  public get recipes_html_url(): string {
    return `${process.env.SITE_URL}/${this.username}/recipes`
  }

  public async setPassword(_: string) {
    return new Promise((resolve, _) => {
      return resolve(true)
    })
  }

  public async checkPassword(_: string) {
    return Promise.resolve(false)
  }

  public async generateToken(): Promise<string> {
    return new Promise((resolve, _reject) => {
      return resolve('')
    })
  }

  public static async findByUsername(_username: string): Promise<User> {
    return null
  }
}
