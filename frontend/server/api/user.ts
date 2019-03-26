import * as express from 'express'
import { Request } from 'express'
import * as _ from 'lodash'
import { importers } from './importer'
import { validateNewRecipe, validateRecipePatch } from '../validate'
import { User, Recipe, RecipeBranch } from '../../models'
import { notFound, internalServerError } from '../errors'
import { HttpStatus } from '../../common/http-status'

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
      .status(HttpStatus.Created)
      .json(await Recipe.createNewRecipe(req.user.userId, req.body))
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.patch(
  '/recipes/:slug/branches/:branch',
  validateRecipePatch,
  async (req: AuthenticatedRequest, res) => {
    try {
      const { slug, branch } = req.params
      const recipe = await Recipe.findOne({
        where: { user_id: req.user.userId, slug }
      })
      if (!recipe) {
        return notFound(res)
      }
      const currentBranch = await RecipeBranch.findOne({
        where: { recipe_id: recipe.id, name: branch }
      })
      if (!currentBranch) {
        return notFound(res)
      }
      res
        .status(HttpStatus.Ok)
        .json(await currentBranch.applyPatch(req.body, req.user.userId))
    } catch (err) {
      return internalServerError(res, err)
    }
  }
)

r.delete('/recipes/:slug', async (req: AuthenticatedRequest, res) => {
  try {
    const { slug } = req.params
    const recipe = await Recipe.findOne({
      where: { user_id: req.user.userId, slug }
    })
    if (!recipe) {
      return notFound(res)
    }
    await recipe.destroy()
    res.status(HttpStatus.NoContent).json()
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.use('/import', importers)

export const user = r
