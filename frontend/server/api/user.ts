import * as express from 'express'
import { Request } from 'express'
import * as _ from 'lodash'
import { importers } from './importer'
import { validateNewRecipe } from '../validate'
import { User } from '../../models/user'
import { Recipe } from '../../models/recipe'

interface UserDetail {
  userId: number
  username: string
}

export interface AuthenticatedRequest extends Request {
  user: UserDetail
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
  try {
    return res
      .status(201)
      .json(await Recipe.createNewRecipe(req.user.userId, req.body))
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
})

r.use('/import', importers)

export const user = r
