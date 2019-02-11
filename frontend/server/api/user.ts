import * as express from 'express'
import { Request } from 'express'

import { validateNewRecipe } from '../validate'
import { User } from '../../models/user'
import { Recipe } from '../../models/recipe'

interface AuthenticatedRequest extends Request {
  user: any
}

const r = express.Router()

r.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findOne({ where: { username: req.user.username } })
    return res.json(user)
  } catch (error) {
    return res.status(500).json({ error })
  }
})

r.post('/recipe', validateNewRecipe, async (req: AuthenticatedRequest, res) => {
  const recipe = Recipe.build(req.body)
  return res.json(recipe)
})

export const user = r
