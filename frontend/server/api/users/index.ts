import * as express from 'express'
import * as _ from 'lodash'

import { User } from '../../../models/user'
import { validateNewUser } from '../../validate'
import { user, UserRequest } from './user'
import { internalServerError, badRequest, notFound } from '../../errors'
import { HttpStatus } from '../../../common/http-status'

const r = express.Router()

const isUniqueUsernameError = (err: any) =>
  'unique violation' === _.get(err, 'errors[0].type', '') &&
  'lower(username::text)' === _.get(err, 'errors[0].path', '')

const isUniqueEmailError = (err: any) =>
  'unique violation' === _.get(err, 'errors[0].type', '') &&
  'email' === _.get(err, 'errors[0].path', '')

r.get('/', async (_, res) => {
  try {
    const users = await User.findAll({ order: [['id', 'DESC']] })
    return res.json(users)
  } catch (error) {
    return internalServerError(res, error)
  }
})

r.post('/', validateNewUser, async (req, res) => {
  const { username, password, email } = req.body
  const u = User.build({ username, email })
  try {
    await u.setPassword(password)
  } catch (e) {
    return internalServerError(res, e)
  }
  try {
    await u.save()
  } catch (e) {
    if (isUniqueUsernameError(e)) {
      return badRequest(res, 'that username is not available')
    }
    if (isUniqueEmailError(e)) {
      return badRequest(
        res,
        'that email address has already been registered, try resetting your password'
      )
    }
    return internalServerError(res, e)
  }
  return res.status(HttpStatus.Created).json(u)
})

r.use(
  '/:username',
  async (req, res, next) => {
    const { username } = req.params
    try {
      const user = await User.findByUsername(username)
      if (!user) {
        return notFound(res)
      }
      ;(req as UserRequest).user = user
      next()
    } catch (error) {
      return internalServerError(res, error)
    }
  },
  user
)

export const users = r
