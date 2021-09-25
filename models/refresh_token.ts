import { User } from './user'

export class RefreshToken {
  public declare id: number

  public user_id: number

  public token: string

  public last_used: Date

  public created_at: Date

  public updated_at: Date

  public deleted_at: Date

  public user: User
}
