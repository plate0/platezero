import * as express from 'express'
import * as _ from 'lodash'

import { User } from '../../../models/user'
import { validateNewUser } from '../../validate'
import { user, UserRequest } from './user'

const r = express.Router()

r.get('/', async (_, res) => {
  try {
    const users = await User.findAll()
    return res.json(users)
  } catch (error) {
    return res.json({ error })
  }
})

r.post('/', validateNewUser, async (req, res) => {
  const { username, password, email } = req.body
  const u = User.build({ username, email })
  try {
    await u.setPassword(password)
  } catch (e) {
    res.status(500)
    return res.json({ error: 'internal server error' })
  }
  try {
    await u.save()
  } catch (e) {
    res.status(400)
    return res.json({ error: 'bad request' })
  }
  return res.json(u)
})

r.use('/:username', async (req, res, next) => {
  const { username } = req.params
  try {
    const user = await User.findOne({ where: { username } })
    if (!user) {
      res.status(404)
      return res.json({ error: 'not found' })
    }
    (req as UserRequest).user = user
    next()
  } catch (error) {
    res.status(500)
    return res.json({ error })
  }
}, user)

export const users = r
