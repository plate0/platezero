import * as express from 'express'
import * as _ from 'lodash'
import * as jwtMiddleware from 'express-jwt'
import { users } from './users'
import { user } from './user'
import { User } from '../../models/user'
import { search } from './search'
import { RefreshToken } from '../../models'
import { config } from '../config'
import {
  unauthorized,
  invalidAuthentication,
  internalServerError,
  badRequest
} from '../errors'

const r = express.Router()

// parse JSON bodies
r.use(express.json())

// check each request for authentication, but don't deny requests without it
r.use(
  jwtMiddleware({
    secret: config.jwtSecret,
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

r.use((err, _req, res, next) => {
  if (err && err.name === 'UnauthorizedError') {
    return invalidAuthentication(res, err.message)
  }
  next()
})

r.use('/users', users)
r.use('/search', search)

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
r.get('/', function apiIndex(_, res) {
  return res.json({
    users_url: `${config.apiUrl}/users`,
    current_user_url: `${config.apiUrl}/user`
  })
})

// login route
r.post('/login', async function login(req, res) {
  const { username, password } = req.body
  if (!username || !password) {
    return badRequest(res, 'username and password are required')
  }
  try {
    const user = await User.findByUsername(username)
    if (!user) {
      return invalidAuthentication(res)
    }
    // it's trivial to discover whether a user exists by visiting /:username,
    // so we're not concerned with timing attacks that leak user existence.
    const validPassword = await user.checkPassword(password)
    if (!validPassword) {
      return invalidAuthentication(res)
    }
    const refresh = await RefreshToken.create({ user_id: user.id })
    return res.json({
      user,
      token: await user.generateToken(),
      refreshToken: refresh.token
    })
  } catch (err) {
    return internalServerError(res, err)
  }
})

// refresh JWT
r.post('/login/refresh', async function getRefreshToken(req, res) {
  const { token } = req.body
  if (!token) {
    return badRequest(res, '`token` is required')
  }
  try {
    const user = await User.findOne({
      include: [
        {
          model: RefreshToken,
          where: {
            deleted_at: null,
            token
          }
        }
      ]
    })
    if (!user) {
      return invalidAuthentication(res)
    }
    const [refresh] = user.refresh_tokens
    if (!refresh) {
      return invalidAuthentication(res)
    }
    await refresh.update({
      last_used: new Date()
    })
    const jwtToken = await user.generateToken()
    return res.json({
      user,
      token: jwtToken
    })
  } catch (err) {
    return internalServerError(res, err)
  }
})

export const api = r
