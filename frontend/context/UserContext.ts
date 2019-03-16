import { createContext } from 'react'
import { UserJSON } from '../models/user'

export const UserContext = createContext<UserJSON | null>(null)
