import * as express from 'express'
import { Request } from 'express'
import * as _ from 'lodash'
import { importers } from './importer'
import { validateNewRecipe, validateRecipePatch } from '../validate'
import { User } from '../../models/user'
import { Recipe } from '../../models/recipe'
import { badRequest, internalServerError } from '../errors'

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

r.patch('/recipes/:slug/branches/:branch', validateRecipePatch, async (req, res) => {
  try {
    const { slug, branch } = req.params
    console.log('slug', slug, 'branch', branch)
    return badRequest(res, ['asdfasdfasdf'])
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.use('/import', importers)

export const user = r
