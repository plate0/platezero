import { createContext } from 'react'
import { UserJSON } from '../models'

export const UserContext = createContext({
  user: null,
  updateUser: (_: UserJSON) => {}
})
