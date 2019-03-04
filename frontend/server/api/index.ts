import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as jwtMiddleware from 'express-jwt'

import { users } from './users'
import { user } from './user'
import { User } from '../../models/user'

export const JWT_SECRET = 'dev secret replace for prod or shit will be fucked'

const r = express.Router()

// parse JSON bodies
r.use(bodyParser.json())

// check each request for authentication, but don't deny requests without it
r.use(
  jwtMiddleware({
    secret: JWT_SECRET,
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
      return res.status(401).json({ error: 'unauthorized' })
    }
    next()
  },
  user
)

// the index route. provide some useful URLs
r.get('/', (_, res) => {
  return res.json({
    users_url: '/users',
    current_user_url: '/user'
  })
})

// login route
r.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(400)
    return res.json({ error: 'bad request' })
  }
  try {
    const user = await User.findOne({ where: { username } })
    if (!user) {
      res.status(401)
      return res.json({ error: 'unauthorized' })
    }
    // it's trivial to discover whether a user exists by visiting /:username,
    // so we're not concerned with timing attacks that leak user existence.
    const validPassword = await user.checkPassword(password)
    if (!validPassword) {
      res.status(401)
      return res.json({ error: 'unauthorized' })
    }
    return res.json({
      user,
      token: await user.generateToken()
    })
  } catch (error) {
    res.status(500)
    return res.json({ error })
  }
})

export const api = r
