import { UserJSON } from '../models/user'

export const getName = (user: UserJSON): string =>
  user.name ? user.name : user.username
