import * as express from 'express'
import { Request } from 'express'
import * as _ from 'lodash'

import { User } from '../../../../models/user'
import { Recipe } from '../../../../models/recipe'
import { RecipeRequest, recipe } from './recipe'
import { notFound, internalServerError } from '../../../errors'

const r = express.Router()

export interface UserRequest extends Request {
  user: User
}

r.get('/', async (req: UserRequest, res) => {
  return res.json(await req.user.reload({ include: [Recipe] }))
})

r.get('/recipes', async (req: UserRequest, res) => {
  return res.json(await Recipe.findAll({ where: { user_id: req.user.id } }))
})

r.use(
  '/recipes/:slug',
  async (req: UserRequest, res, next) => {
    const { slug } = req.params
    try {
      const recipe = await Recipe.findOne({
        where: { user_id: req.user.id, slug }
      })
      if (!recipe) {
        return notFound(res)
      }
      ;(req as RecipeRequest).recipe = recipe
      next()
    } catch (error) {
      return internalServerError(res, error)
    }
  },
  recipe
)

export const user = r
