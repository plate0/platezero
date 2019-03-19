import { useContext } from 'react'
import { get } from 'lodash'
import { UserContext } from '../context/UserContext'

interface Props {
  username?: string
  else?: any
  children: any
}

export const IfLoggedIn = (props: Props) => {
  const user = useContext(UserContext)
  const guarded = props.children
  const fallback = props.else || null

  // if a username is provided and matches the currently logged in user
  if (props.username) {
    return get(user, 'username') === props.username ? guarded : fallback
  }

  return user ? guarded : fallback
}
