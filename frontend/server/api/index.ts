import * as express from 'express'
import * as jwtMiddleware from 'express-jwt'
import { users } from './users'
import { user } from './user'
import { User } from '../../models/user'
import { getConfig } from '../config'
import {
  unauthorized,
  invalidAuthentication,
  internalServerError,
  badRequest
} from '../errors'

const cfg = getConfig()
const r = express.Router()

// parse JSON bodies
r.use(express.json())

// check each request for authentication, but don't deny requests without it
r.use(
  jwtMiddleware({
    secret: cfg.jwtSecret,
    credentialsRequired: false,
    getToken: req => {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
      ) {
        return req.headers.authorization.split(' ')[1]
      }
      return null
    }
  })
)

r.use('/users', users)

// the /user path represents the _currently authenticated_ user. this is where
// things like changing passwords, creating recipes, etc happen. so in this
// case, we kick them out if they're not logged in.
r.use(
  '/user',
  (req, res, next) => {
    const { user } = req as any
    if (!user) {
      return unauthorized(res)
    }
    next()
  },
  user
)

// the index route. provide some useful URLs
r.get('/', (_, res) => {
  return res.json({
    users_url: `${cfg.apiUrl}/users`,
    current_user_url: `${cfg.apiUrl}/user`
  })
})

// login route
r.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return badRequest(res, 'username and password are required')
  }
  try {
    const user = await User.findOne({ where: { username } })
    if (!user) {
      return invalidAuthentication(res)
    }
    // it's trivial to discover whether a user exists by visiting /:username,
    // so we're not concerned with timing attacks that leak user existence.
    const validPassword = await user.checkPassword(password)
    if (!validPassword) {
      return invalidAuthentication(res)
    }
    return res.json({
      user,
      token: await user.generateToken()
    })
  } catch (err) {
    return internalServerError(res, err)
  }
})

export const api = r
