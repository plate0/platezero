import * as express from 'express'
import { Request } from 'express'
import * as _ from 'lodash'

import { validateNewRecipe } from '../validate'
import { User } from '../../models/user'
import { Recipe } from '../../models/recipe'
import { internalServerError } from '../errors'

interface UserDetail {
  userId: number
  username: string
}

interface AuthenticatedRequest extends Request {
  user: UserDetail
}

const r = express.Router()

r.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findOne({ where: { username: req.user.username } })
    return res.json(user)
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.post('/recipe', validateNewRecipe, async (req: AuthenticatedRequest, res) => {
  try {
    return res
      .status(201)
      .json(await Recipe.createNewRecipe(req.user.userId, req.body))
  } catch (err) {
    return internalServerError(res, err)
  }
})

export const user = r
