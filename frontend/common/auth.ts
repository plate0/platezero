import cookie from 'js-cookie'
import nextCookie from 'next-cookies'
import { UserJSON } from '../models/user'

export interface Authentication {
  token?: string
  refresh?: string
  user?: UserJSON
}

export const authenticated = async (token: string, refresh: string) => {
  cookie.set('auth', JSON.stringify({ token, refresh }), {
    expires: 365,
    secure: true,
    samesite: 'strict'
  } as any)
}

export const getAuth = (ctx: any = undefined): Authentication => {
  try {
    const { auth } = ctx ? nextCookie(ctx) : cookie.get()
    return JSON.parse(auth)
  } catch {
    return {}
  }
}
