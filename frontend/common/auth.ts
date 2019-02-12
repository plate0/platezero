import Router from 'next/router'
import cookie from 'js-cookie'
import { User } from '../models/user'

export const authenticated = async (user: User, token: string) => {
  cookie.set('token', token, { expires: 1 })
  Router.push(`/${user.username}`)
}

export const extractToken = (cookies?: string) => {
  const regex = /token=(.*);/gm
  let m
  while ((m = regex.exec(cookies)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      console.log(`Found match, group ${groupIndex}: ${match}`)
    })
  }
}
